import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schema/book.schema';
import { Model } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
import { Response } from 'src/types/Response';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async create(dto: CreateBookDto): Promise<BookDocument> {
    return await new this.bookModel(dto).save();
  }

  async findAll(): Promise<BookDocument[]> {
    return await this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<BookDocument | null> {
    const book = await this.bookModel.findById(id);

    if (!book) throw new NotFoundException();
    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookDocument> {
    const book = await this.bookModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!book) throw new NotFoundException();

    return book;
  }

  async delete(id: string): Promise<Response> {
    const book = await this.bookModel.findById(id);

    if (!book) throw new NotFoundException();

    await this.bookModel.findByIdAndDelete(id);

    return {
      message: 'Book deleted',
      code: HttpStatus.NO_CONTENT,
    };
  }
}
