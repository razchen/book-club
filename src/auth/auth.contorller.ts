import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RequestWithUser } from 'src/types/Auth';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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

    return doc;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto, @Request() req: RequestWithUser) {
    const { id } = req.user;
    return this.authService.refresh(id, dto);
  }
}
