import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { registerDto } from './dto/register.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Roles } from 'src/app.roles';
import { Role } from 'src/types/Auth';
import { RefreshDto } from './dto/refresh.dto';

type Payload = {
  id: Types.ObjectId;
  email: string;
  roles: Role[];
};

type Tokens = {
  accessToken: string;
  refreshToken: string;
  hashedRefreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getTokens(payload: Payload): Promise<Tokens> {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || '',
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET') || '',
      expiresIn: '30d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    return { accessToken, refreshToken, hashedRefreshToken };
  }

  async refresh(
    id: string,
    dto: RefreshDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userRefreshToken = dto.refreshToken;
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new BadRequestException();
    }

    const isRefreshTokenValid = await bcrypt.compare(
      userRefreshToken,
      user?.hashedRefreshToken || '',
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException();
    }

    const payload = { id: user._id, email: user.email, roles: user.roles };
    const { accessToken, refreshToken, hashedRefreshToken } =
      await this.getTokens(payload);

    await this.userModel.findByIdAndUpdate(id, { hashedRefreshToken });

    return { accessToken, refreshToken };
  }

  async login(user: UserDocument) {
    try {
      const payload = { id: user._id, email: user.email, roles: user.roles };

      const { accessToken, refreshToken, hashedRefreshToken } =
        await this.getTokens(payload);

      await this.userModel.findByIdAndUpdate(user._id, { hashedRefreshToken });

      return {
        id: user._id.toString(),
        roles: user.roles,
        accessToken,
        refreshToken,
      };
    } catch {
      throw new InternalServerErrorException('Login error');
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select(['email', 'password', 'roles']);

      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }

      return null;
    } catch {
      throw new InternalServerErrorException('Login error');
    }
  }

  async register(dto: registerDto) {
    const { email } = dto;

    const exists = await this.userModel.findOne({ email });
    if (exists) {
      throw new BadRequestException('User already exist');
    }

    const hashed: string = await bcrypt.hash(dto.password, 10);

    const user = await new this.userModel({
      ...dto,
      password: hashed,
      roles: [Roles.user],
    }).save();

    const payload = { id: user._id, email: user.email, roles: user.roles };

    const { hashedRefreshToken, accessToken, refreshToken } =
      await this.getTokens(payload);

    const updated = await this.userModel.findByIdAndUpdate(
      user._id,
      { hashedRefreshToken },
      {
        new: true,
      },
    );

    return { ...updated?.toObject(), accessToken, refreshToken };
  }
}
