import { InjectModel } from '@nestjs/mongoose';
import { BookClub, BookClubDocument } from './schema/book-club.schema';
import { Model, Types } from 'mongoose';
import { CreateBookClubDto } from './dto/create-book-club.dto';
import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBookClubDto } from './dto/update-book-club.dto';
import { Response } from 'src/types/Response';
import {
  BookClubBook,
  BookClubBookDocument,
} from './schema/book-club-book.schema';
import { Book } from 'src/book/schema/book.schema';

type PopulatedBookClub = Omit<BookClub, 'books'> & {
  books: Book[];
};

export class BookClubsService {
  constructor(
    @InjectModel(BookClub.name)
    private readonly bookClubModel: Model<BookClubDocument>,
    @InjectModel(BookClubBook.name)
    private readonly bookClubBookModel: Model<BookClubBookDocument>,
  ) {}

  async create(
    dto: CreateBookClubDto,
    owner: string,
  ): Promise<BookClubDocument> {
    try {
      return await new this.bookClubModel({ ...dto, owner }).save();
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  async findAll(): Promise<PopulatedBookClub[]> {
    try {
      const bookClubs = await this.bookClubModel.find().populate({
        path: 'books',
        populate: { path: 'book' },
      });

      return bookClubs.map((club) => {
        const c = club.toObject() as unknown as BookClub & {
          books: { book: Book }[];
        };

        return {
          ...c,
          books: c.books.map((b) => b.book),
        };
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch books');
    }
  }

  async findOne(id: string): Promise<BookClubDocument> {
    try {
      const bookClub = await this.bookClubModel.findById(id);

      if (!bookClub) throw new NotFoundException();

      return bookClub;
    } catch {
      throw new InternalServerErrorException('Failed to fetch book');
    }
  }

  async update(
    id: string,
    dto: UpdateBookClubDto,
    owner: string,
  ): Promise<BookClubDocument> {
    try {
      const bookClub = await this.bookClubModel.findById(id);

      if (!bookClub) throw new NotFoundException();

      if (bookClub.owner.toString() !== owner) throw new BadRequestException();

      const updated = await this.bookClubModel.findByIdAndUpdate(id, dto, {
        new: true,
      });

      if (!updated) throw new NotFoundException();

      return updated;
    } catch {
      throw new InternalServerErrorException('Failed to update book');
    }
  }

  async delete(id: string, owner: string): Promise<Response> {
    try {
      const bookClub = await this.bookClubModel.findById(id);

      if (!bookClub) throw new NotFoundException();

      if (bookClub.owner.toString() !== owner) throw new BadRequestException();

      await this.bookClubModel.findByIdAndDelete(id);

      return {
        message: 'Book Club deleted',
        code: HttpStatus.NO_CONTENT,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async addBook(
    bookClubId: string,
    bookId: string,
    owner: string,
  ): Promise<BookClub> {
    try {
      const bookClub = await this.bookClubModel.findById(bookClubId);

      if (!bookClub) throw new NotFoundException();

      if (bookClub.owner.toString() !== owner) throw new BadRequestException();

      const exists = await this.bookClubBookModel.exists({
        bookClub: new Types.ObjectId(bookClubId),
        book: new Types.ObjectId(bookId),
      });

      if (!exists) {
        await new this.bookClubBookModel({
          bookClub: new Types.ObjectId(bookClubId),
          book: new Types.ObjectId(bookId),
        }).save();
      }

      const bookClubUpdated = await this.bookClubModel
        .findById(bookClubId)
        .populate({ path: 'books', populate: { path: 'book' } });

      if (!bookClubUpdated) {
        throw new NotFoundException('BookClub not found after adding book');
      }

      return bookClubUpdated;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to add book');
    }
  }

  async removeBook(
    bookClubId: string,
    bookId: string,
    owner: string,
  ): Promise<BookClubDocument> {
    try {
      const bookClub = await this.bookClubModel.findById(bookClubId);

      console.log('bookClub', bookClub);

      if (!bookClub) throw new NotFoundException();

      if (bookClub.owner.toString() !== owner) throw new BadRequestException();

      const exists = await this.bookClubBookModel.exists({
        bookClub: new Types.ObjectId(bookClubId),
        book: new Types.ObjectId(bookId),
      });

      console.log('exists', exists);

      if (exists) {
        await this.bookClubBookModel.deleteOne({
          bookClub: new Types.ObjectId(bookClubId),
          book: new Types.ObjectId(bookId),
        });
      }

      const bookClubUpdated = await this.bookClubModel
        .findById(bookClubId)
        .populate({ path: 'books', populate: { path: 'book' } });

      if (!bookClubUpdated) {
        throw new NotFoundException('BookClub not found after adding book');
      }

      return bookClubUpdated;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('Failed to remove book');
    }
  }
}
