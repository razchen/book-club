import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './schema/book.schema';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('BookService', () => {
  let service: BookService;
  let bookModel: jest.Mocked<Model<any>>;

  const mockBook = {
    _id: '507f191e810c19729de860ea',
    title: 'Test Book',
    author: 'Tester',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookModel = module.get(getModelToken(Book.name));
  });

  it('should return all books', async () => {
    bookModel.find.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue([mockBook]),
    } as any);

    const books = await service.findAll();
    expect(books).toEqual([mockBook]);
    expect(bookModel.find).toHaveBeenCalled();
  });

  it('should return one book by id', async () => {
    bookModel.findById.mockResolvedValueOnce(mockBook as any);

    const book = await service.findOne('507f191e810c19729de860ea');
    expect(book).toEqual(mockBook);
  });

  it('should throw if book not found', async () => {
    bookModel.findById.mockResolvedValueOnce(null);

    await expect(service.findOne('notfoundid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a book', async () => {
    const saveMock = jest.fn().mockResolvedValue(mockBook);
    const bookModelConstructor = jest.fn(() => ({ save: saveMock }));

    const module = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: Object.assign(bookModelConstructor, bookModel),
        },
      ],
    }).compile();

    const localService = module.get<BookService>(BookService);

    const dto = { title: 'Test Book', author: 'Tester' };
    const result = await localService.create(dto as any);
    expect(result).toEqual(mockBook);
    expect(saveMock).toHaveBeenCalled();
  });

  it('should update a book', async () => {
    const updatedBook = { ...mockBook, title: 'Updated' };
    bookModel.findByIdAndUpdate.mockResolvedValueOnce(updatedBook as any);

    const updated = await service.update('507f191e810c19729de860ea', {
      title: 'Updated',
    });

    expect(updated).toEqual(updatedBook);
  });

  it('should throw when updating nonexistent book', async () => {
    bookModel.findByIdAndUpdate.mockResolvedValueOnce(null);
    await expect(service.update('badid', {} as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a book', async () => {
    bookModel.findById.mockResolvedValueOnce(mockBook as any);
    bookModel.findByIdAndDelete.mockResolvedValueOnce(mockBook as any);

    const result = await service.delete('507f191e810c19729de860ea');
    expect(result).toEqual({
      message: 'Book deleted',
      code: 204,
    });
  });

  it('should throw when deleting nonexistent book', async () => {
    bookModel.findById.mockResolvedValueOnce(null);
    await expect(service.delete('badid')).rejects.toThrow(NotFoundException);
  });
});
