import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock the bcrypt module
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const createUserDto = {
    email: 'exist@gmail.com',
    password: '123456',
    firstName: 'John',
    lastName: 'Synchron',
  };

  const res = {
    cookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('POST /auth/signup should not allow duplicate email registration', async () => {
    usersService.findOneByEmail.mockResolvedValueOnce({
      email: 'exist@gmail.com',
    } as any);

    await expect(service.signUp(createUserDto, res as any)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('POST /auth/singin return access and refresh tokens', async () => {
    const hash = await bcrypt.hash('123456', 12);
    usersService.findOneByEmail.mockResolvedValueOnce({
      toObject: () => ({
        id: '1',
        email: 'test@gmail.com',
        password: hash,
      }),
    } as any);

    jwtService.signAsync.mockReturnValueOnce(Promise.resolve('access-token'));
    jwtService.signAsync.mockReturnValueOnce(Promise.resolve('refresh-token'));

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.signIn(
      {
        email: 'test@gmail.com',
        password: '123456',
      } as any,
      res as any,
    );

    expect(result.tokens).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(result.user).toEqual({
      id: '1',
      email: 'test@gmail.com',
    });
  });
});
//
