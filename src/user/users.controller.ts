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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'src/types/Response';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/types/Auth';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<UserDocument> {
    return await this.usersService.create(dto);
  }

  @Get()
  async findAll(): Promise<UserDocument[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDocument> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    dto: UpdateUserDto,
  ): Promise<UserDocument> {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Response> {
    return await this.usersService.delete(id);
  }
}
