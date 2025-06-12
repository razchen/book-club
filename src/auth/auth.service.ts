import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { registerDto } from './dto/register.dto';
import {
  BadRequestException,
  Body,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  login(user: UserDocument) {
    try {
      const payload = { id: user._id, email: user.email };
      return {
        accessToken: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_SECRET') || '',
        }),
      };
    } catch {
      throw new InternalServerErrorException('Login error');
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select(['email', 'password']);

      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }

      return null;
    } catch {
      throw new InternalServerErrorException('Login error');
    }
  }

  async register(dto: registerDto) {
    try {
      const { email } = dto;

      const user = await this.userModel.findOne({ email });
      if (user) {
        throw new BadRequestException('User already exist');
      }

      const hashed: string = await bcrypt.hash(dto.password, 10);

      return await new this.userModel({ ...dto, password: hashed }).save();
    } catch {
      throw new InternalServerErrorException('Registration failed');
    }
  }
}
