import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'src/types/Response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    try {
      return await new this.userModel(dto).save();
    } catch {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userModel.find();
    } catch {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch {
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, dto, {
        new: true,
      });

      if (!user) {
        throw new NotFoundException();
      }

      return user;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<Response> {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new NotFoundException();
      }

      await this.userModel.findByIdAndDelete(id);

      return {
        message: 'User deleted',
        code: HttpStatus.NO_CONTENT,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
