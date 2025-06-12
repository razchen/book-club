import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schema/book.schema';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import {
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { Response } from 'src/types/Response';

export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async create(dto: CreateBookDto): Promise<BookDocument> {
    try {
      return await new this.bookModel(dto).save();
    } catch {
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  async findAll(): Promise<BookDocument[]> {
    try {
      return await this.bookModel.find();
    } catch {
      throw new InternalServerErrorException('Failed to fetch books');
    }
  }

  async findOne(id: string): Promise<BookDocument> {
    try {
      const book = await this.bookModel.findById(id);

      if (!book) throw new NotFoundException();
      return book;
    } catch {
      throw new InternalServerErrorException('Failed to fetch book');
    }
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookDocument> {
    try {
      const book = await this.bookModel.findByIdAndUpdate(id, dto, {
        new: true,
      });

      if (!book) throw new NotFoundException();

      return book;
    } catch {
      throw new InternalServerErrorException('Failed to update book');
    }
  }

  async delete(id: string): Promise<Response> {
    try {
      const book = await this.bookModel.findById(id);

      if (!book) throw new NotFoundException();

      await this.bookModel.findByIdAndDelete(id);

      return {
        message: 'Book deleted',
        code: HttpStatus.NO_CONTENT,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
