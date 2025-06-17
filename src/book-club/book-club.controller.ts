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
import { BookClubService } from './book-club.service';
import { CreateBookClubDto } from './dto/create-book-club.dto';
import { UpdateBookClubDto } from './dto/update-book-club.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/Auth';
import { plainToInstance } from 'class-transformer';
import { BookClubDto } from './dto/book-club.dto';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { BookClubHook } from './book-club.hook';
import { BookClubSubjectDto } from './dto/book-club-subject.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('book-clubs')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class BookClubsController {
  constructor(private readonly bookClubService: BookClubService) {}

  @Post()
  async create(
    @Body() dto: CreateBookClubDto,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    return this.bookClubService.create(dto, userId);
  }

  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, BookClubDto)
  @Get()
  async findAll() {
    const docs = await this.bookClubService.findAll();

    return plainToInstance(BookClubDto, docs, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    const doc = await this.bookClubService.findOne(id);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, BookClubSubjectDto, BookClubHook)
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateBookClubDto,
  ) {
    const doc = await this.bookClubService.update(id, dto);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    return this.bookClubService.delete(id);
  }

  @Post(':id/add-book/:bookId')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, BookClubSubjectDto, BookClubHook)
  async addBook(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('bookId') bookId: string,
  ) {
    const doc = await this.bookClubService.addBook(id, bookId);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id/remove-book/:bookId')
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, BookClubSubjectDto, BookClubHook)
  async removeBook(
    @Param('id', ParseObjectIdPipe) id: string,
    @Param('bookId') bookId: string,
  ) {
    const doc = await this.bookClubService.removeBook(id, bookId);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Post(':id/add-user')
  async addUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    const doc = await this.bookClubService.addUser(id, userId);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id/remove-user')
  async removeUser(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    const doc = await this.bookClubService.removeUser(id, userId);

    return plainToInstance(BookClubDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
