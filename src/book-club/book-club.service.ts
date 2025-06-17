import { InjectModel } from '@nestjs/mongoose';
import { BookClub, BookClubDocument } from './schema/book-club.schema';
import { Model, Types } from 'mongoose';
import { CreateBookClubDto } from './dto/create-book-club.dto';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateBookClubDto } from './dto/update-book-club.dto';
import { Response } from 'src/types/Response';
import {
  BookClubBook,
  BookClubBookDocument,
} from './schema/book-club-book.schema';
import { Membership, MembershipDocument } from './schema/membership.schema';

@Injectable()
export class BookClubService {
  constructor(
    @InjectModel(BookClub.name)
    private readonly bookClubModel: Model<BookClubDocument>,
    @InjectModel(BookClubBook.name)
    private readonly bookClubBookModel: Model<BookClubBookDocument>,
    @InjectModel(Membership.name)
    private readonly membershipModel: Model<MembershipDocument>,
  ) {}

  async create(
    dto: CreateBookClubDto,
    owner: string,
  ): Promise<BookClubDocument> {
    return await new this.bookClubModel({
      ...dto,
      owner: new Types.ObjectId(owner),
    }).save();
  }

  async findAll(): Promise<BookClub[]> {
    const clubs = await this.bookClubModel
      .find()
      .populate('owner')
      .populate({
        path: 'books',
        populate: { path: 'book', model: 'Book' },
      })
      .populate({
        path: 'users',
        populate: { path: 'user', model: 'User' },
      });

    console.log('clubs', JSON.stringify(clubs));

    return clubs;
  }

  async findOne(id: string, populate = true): Promise<BookClubDocument | null> {
    let q = this.bookClubModel.findById(id);

    if (populate) {
      q = q.populate('owner').populate({
        path: 'books',
        populate: { path: 'book', model: 'Book' },
      });
    }

    const bookClub = await q.exec();

    if (!bookClub) {
      throw new NotFoundException('Book club not found');
    }

    return bookClub;
  }

  async update(id: string, dto: UpdateBookClubDto): Promise<BookClubDocument> {
    const bookClub = await this.bookClubModel.findById(id);

    if (!bookClub) throw new NotFoundException();

    const updated = await this.bookClubModel
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .populate('owner')
      .lean();

    if (!updated) throw new NotFoundException();

    return updated;
  }

  async delete(id: string): Promise<Response> {
    const bookClub = await this.bookClubModel.findById(id);

    if (!bookClub) throw new NotFoundException();

    await this.bookClubModel.findByIdAndDelete(id);

    return {
      message: 'Book Club deleted',
      code: HttpStatus.NO_CONTENT,
    };
  }

  async addBook(bookClubId: string, bookId: string): Promise<BookClubDocument> {
    const bookClub = await this.bookClubModel.findById(bookClubId).exec();

    if (!bookClub) throw new NotFoundException();

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
  }

  async removeBook(
    bookClubId: string,
    bookId: string,
  ): Promise<BookClubDocument> {
    const bookClub = await this.bookClubModel.findById(bookClubId);

    if (!bookClub) throw new NotFoundException();

    const exists = await this.bookClubBookModel.exists({
      bookClub: new Types.ObjectId(bookClubId),
      book: new Types.ObjectId(bookId),
    });

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
  }

  async addUser(bookClubId: string, userId: string): Promise<BookClubDocument> {
    const bookClub = await this.bookClubModel.findById(bookClubId);

    if (!bookClub) throw new NotFoundException();

    const exists = await this.membershipModel.exists({
      bookClub: new Types.ObjectId(bookClubId),
      user: new Types.ObjectId(userId),
    });

    if (!exists) {
      await new this.membershipModel({
        bookClub: new Types.ObjectId(bookClubId),
        user: new Types.ObjectId(userId),
      }).save();
    }

    const populated = await this.bookClubModel.findById(bookClubId).populate({
      path: 'users',
      populate: { path: 'user' },
    });

    if (!populated)
      throw new NotFoundException('Book club not found after update');

    return populated;
  }

  async removeUser(
    bookClubId: string,
    userId: string,
  ): Promise<BookClubDocument> {
    const bookClub = await this.bookClubModel.findById(bookClubId);

    if (!bookClub) throw new NotFoundException();

    const exists = await this.membershipModel.exists({
      bookClub: new Types.ObjectId(bookClubId),
      user: new Types.ObjectId(userId),
    });

    if (exists) {
      await this.membershipModel.deleteOne({
        bookClub: new Types.ObjectId(bookClubId),
        user: new Types.ObjectId(userId),
      });
    }

    const populated = await this.bookClubModel.findById(bookClubId).populate({
      path: 'users',
      populate: { path: 'user' },
    });

    if (!populated) throw new NotFoundException();

    return populated;
  }
}
