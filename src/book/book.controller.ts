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
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { plainToInstance } from 'class-transformer';
import { BookDto } from './dto/book.dto';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';

@Controller('books')
@UseGuards(JwtAuthGuard, AccessGuard)
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  @UseAbility(Actions.create, BookDto)
  async create(@Body() dto: CreateBookDto) {
    const doc = await this.bookService.create(dto);

    return plainToInstance(BookDto, doc, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @UseAbility(Actions.read, BookDto)
  async findAll() {
    const doc = await this.bookService.findAll();
    return plainToInstance(BookDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Get(':id')
  @UseAbility(Actions.read, BookDto)
  async findOne(@Param('id') id: string) {
    const doc = await this.bookService.findOne(id);
    return plainToInstance(BookDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Patch(':id')
  @UseAbility(Actions.update, BookDto)
  async update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    const doc = await this.bookService.update(id, dto);

    return plainToInstance(BookDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  @Delete(':id')
  @UseAbility(Actions.delete, BookDto)
  async delete(@Param('id') id: string) {
    return this.bookService.delete(id);
  }
}
