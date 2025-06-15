import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookClubsService } from './book-clubs.service';
import { CreateBookClubDto } from './dto/create-book-club.dto';
import { UpdateBookClubDto } from './dto/update-book-club.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from 'src/types/Auth';

@Controller('book-clubs')
@UseGuards(JwtAuthGuard)
export class BookClubsController {
  constructor(private bookClubsService: BookClubsService) {}

  @Post()
  async create(
    @Body() dto: CreateBookClubDto,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    return this.bookClubsService.create(dto, userId);
  }

  @Get()
  async findAll() {
    return this.bookClubsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookClubsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookClubDto,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    return this.bookClubsService.update(id, dto, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.id;
    return this.bookClubsService.delete(id, userId);
  }

  @Post(':id/add-book/:bookId')
  async addBook(
    @Param('id') id: string,
    @Param('bookId') bookId: string,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    return await this.bookClubsService.addBook(id, bookId, userId);
  }

  @Delete(':id/remove-book/:bookId')
  async removeBook(
    @Param('id') id: string,
    @Param('bookId') bookId: string,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    return await this.bookClubsService.removeBook(id, bookId, userId);
  }

  @Post(':id/add-user')
  async addUser(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.id;
    return await this.bookClubsService.addUser(id, userId);
  }

  @Delete(':id/remove-user')
  async removeUser(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.id;
    return await this.bookClubsService.removeUser(id, userId);
  }
}
