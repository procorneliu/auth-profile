import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { S3Service } from '../s3/s3.service';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private s3Service: S3Service,
  ) {}

  @Post('/:id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', { storage: multer.memoryStorage() }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const key = `${id}-${Date.now()}`;
    const url = await this.s3Service.uploadFile(key, file);

    return this.usersService.updateAvatar(id, url);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('/me')
  getMe(@CurrentUser() userId: string) {
    return this.usersService.getMe(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
