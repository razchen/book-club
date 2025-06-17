import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: loginDto) {
    const { email, password } = dto;
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() dto: registerDto) {
    const doc = await this.authService.register(dto);

    return plainToInstance(UserDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
