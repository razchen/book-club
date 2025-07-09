import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'src/types/Response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    return await new this.userModel(dto).save();
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async delete(id: string): Promise<Response> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userModel.findByIdAndDelete(id);

    return {
      message: 'User deleted',
      code: HttpStatus.NO_CONTENT,
    };
  }
}
