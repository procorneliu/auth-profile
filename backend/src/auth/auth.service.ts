import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async signUp(createUsersDto: CreateUserDto, res: Response) {
    const userExists = await this.usersService.findOneByEmail(
      createUsersDto.email,
    );
    if (userExists) throw new BadRequestException('User already exists');

    const newUser = await this.usersService.create(createUsersDto);

    const tokens = await this.getTokens(newUser.id, newUser.email);

    this.setCookies(res, tokens);

    return { user: newUser, tokens };
  }

  async signIn(authDto: AuthDto, res: Response) {
    const user = await this.usersService.findOneByEmail(authDto.email, true);
    if (!user) throw new BadRequestException('Incorrect email or password.');

    const isPasswordCorrect = await bcrypt.compare(
      authDto.password,
      user.password,
    );
    if (!isPasswordCorrect)
      throw new BadRequestException('Incorrect email or password');

    const tokens = await this.getTokens(user.id, user.email);

    // update refresh in DB
    await this.usersService.update(user.id, {
      refresh_token: tokens.refreshToken,
    });

    this.setCookies(res, tokens);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refresh_token, ...userData } = user.toObject();

    return {
      user: userData,
      tokens,
    };
  }

  async logout(id: string, res: Response) {
    const user = await this.usersService.update(id, {
      refresh_token: null,
    });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return user;
  }

  async refreshTokens(email: string, refreshToken: string) {
    const user = await this.usersService.findOneByEmail(email, true);
    if (!user || !refreshToken || !user.refresh_token)
      throw new ForbiddenException('Access denied!');
    const refreshTokenMath = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    if (!refreshTokenMath) throw new ForbiddenException('Access denied!');

    const tokens = await this.getTokens(user.id, email);

    return tokens;
  }

  async getTokens(id: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.getOrThrow('ACCESS_TTL'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          email,
        },
        {
          secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.getOrThrow('REFRESH_TTL'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 3, // 3 minutes
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
  }
}
