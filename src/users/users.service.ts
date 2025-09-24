import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    if (!user) throw new BadRequestException('Creation of user failed!');

    return await user.save();
  }

  async findAll() {
    const users = await this.userModel.find();
    if (!users) throw new NotFoundException('No user found!');

    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async findOneByEmail(email: string, selectPass = false) {
    const user = selectPass
      ? await this.userModel
          .findOne({ email })
          .select('+password +refresh_token')
      : await this.userModel.findOne({ email });

    // not catching cases where user not found, it is caught in other services
    return user;
  }

  async getMe(id: string) {
    return await this.userModel.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true, runValidators: true },
    );
    if (!updatedUser) throw new BadRequestException('Updating of user failed!');

    return updatedUser;
  }

  async updateAvatar(id: string, url: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        avatarUrl: url,
      },
      { new: true, runValidators: true },
    );

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  async remove(id: string) {
    const userToDelete = await this.userModel.findByIdAndDelete(id);
    if (!userToDelete) throw new NotFoundException('User not found!');

    return null;
  }
}
