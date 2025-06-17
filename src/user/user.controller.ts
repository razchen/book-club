import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'src/types/Response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { UserDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@UseGuards(JwtAuthGuard, AccessGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseAbility(Actions.create, UserDto)
  async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    const doc = await this.userService.create(dto);
    return plainToInstance(UserDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get()
  @UseAbility(Actions.read, UserDto)
  async findAll(): Promise<UserDto[]> {
    const docs = await this.userService.findAll();

    return plainToInstance(UserDto, docs, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  @UseAbility(Actions.read, UserDto)
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const doc = await this.userService.findOne(id);

    return plainToInstance(UserDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Patch(':id')
  @UseAbility(Actions.update, UserDto)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    const doc = await this.userService.update(id, dto);

    return plainToInstance(UserDto, doc, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    });
  }

  @Delete(':id')
  @UseAbility(Actions.delete, UserDto)
  async delete(@Param('id') id: string): Promise<Response> {
    return await this.userService.delete(id);
  }
}
