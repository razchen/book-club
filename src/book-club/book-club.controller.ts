import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookClubsService } from './book-clubs.service';
import { CreateBookClubDto } from './dto/create-book-club.dto';
import { UpdateBookClubDto } from './dto/update-book-club.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/Auth';
import { plainToInstance } from 'class-transformer';
import { BookClubDto } from './dto/book-club.dto';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { BookClubHook } from './book-club.hook';
import { BookClubSubjectDto } from './dto/book-club-subject.dto';

@Controller('book-clubs')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class BookClubsController {
  constructor(private readonly bookClubsService: BookClubsService) {}

  @Post()
  async create(
    @Body() dto: CreateBookClubDto,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    return this.bookClubsService.create(dto, userId);
  }

  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, BookClubDto)
  @Get()
  async findAll() {
    const docs = await this.bookClubsService.findAll();

    return plainToInstance(BookClubDto, docs, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.bookClubsService.findOne(id);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, BookClubSubjectDto, BookClubHook)
  async update(@Param('id') id: string, @Body() dto: UpdateBookClubDto) {
    const doc = await this.bookClubsService.update(id, dto);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bookClubsService.delete(id);
  }

  @Post(':id/add-book/:bookId')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, BookClubSubjectDto, BookClubHook)
  async addBook(@Param('id') id: string, @Param('bookId') bookId: string) {
    const doc = await this.bookClubsService.addBook(id, bookId);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id/remove-book/:bookId')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, BookClubSubjectDto, BookClubHook)
  async removeBook(@Param('id') id: string, @Param('bookId') bookId: string) {
    const doc = await this.bookClubsService.removeBook(id, bookId);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Post(':id/add-user')
  async addUser(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.id;
    const doc = await this.bookClubsService.addUser(id, userId);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id/remove-user')
  async removeUser(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.id;
    const doc = await this.bookClubsService.removeUser(id, userId);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
