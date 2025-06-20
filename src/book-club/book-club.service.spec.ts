import { Model, Types } from 'mongoose';
import { BookClubService } from './book-club.service';
import { BookClub } from './schema/book-club.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Membership } from './schema/membership.schema';
import { BookClubBook } from './schema/book-club-book.schema';

describe('BookClubService', () => {
  let service: BookClubService;
  let bookClubModel: jest.Mocked<Model<any>>;

  const mockBookClub = {
    _id: '507f191e810c19729de860ea',
    name: 'Book of the month',
    owner: {
      _id: '507f191e810c19729de860ea',
      name: 'Jojo Halastra',
    },
    users: [
      {
        user: { name: 'Avi Halastra' },
      },
    ],
    books: [
      {
        book: { name: 'The old man and the sea', author: 'Yoni toledano' },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookClubService,
        {
          provide: getModelToken(BookClub.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken('BookClubBook'),
          useValue: {},
        },
        { provide: getModelToken('Membership'), useValue: {} },
      ],
    }).compile();

    service = module.get<BookClubService>(BookClubService);
    bookClubModel = module.get(getModelToken(BookClub.name));
  });

  it('should return all book clubs', async () => {
    const mockExec = jest.fn().mockResolvedValue([mockBookClub]);

    const mockPopulate3 = jest.fn().mockReturnValue({ exec: mockExec });
    const mockPopulate2 = jest
      .fn()
      .mockReturnValue({ populate: mockPopulate3 });
    const mockPopulate1 = jest
      .fn()
      .mockReturnValue({ populate: mockPopulate2 });

    bookClubModel.find.mockReturnValueOnce({
      populate: mockPopulate1,
    } as any);

    const result = await service.findAll();
    expect(result).toEqual([mockBookClub]);
    expect(bookClubModel.find).toHaveBeenCalled();
    expect(mockPopulate1).toHaveBeenCalledWith('owner');
    expect(mockPopulate2).toHaveBeenCalledWith({
      path: 'books',
      populate: { path: 'book', model: 'Book' },
    });
    expect(mockPopulate3).toHaveBeenCalledWith({
      path: 'users',
      populate: { path: 'user', model: 'User' },
    });
  });

  it('should return one book club by id', async () => {
    const mockExec = jest.fn().mockResolvedValue(mockBookClub);

    const mockPopulate2 = jest.fn().mockReturnValue({ exec: mockExec });
    const mockPopulate1 = jest
      .fn()
      .mockReturnValue({ populate: mockPopulate2 });

    bookClubModel.findById.mockReturnValueOnce({
      populate: mockPopulate1,
    } as any);

    const result = await service.findOne('507f191e810c19729de860ea');
    expect(result).toEqual(mockBookClub);
    expect(mockPopulate1).toHaveBeenCalledWith('owner');
    expect(mockPopulate2).toHaveBeenCalledWith({
      path: 'books',
      populate: { path: 'book', model: 'Book' },
    });
  });

  it('should throw if book club not found', async () => {
    const mockExec = jest.fn().mockResolvedValue(null);

    const mockPopulate2 = jest.fn().mockReturnValue({ exec: mockExec });
    const mockPopulate1 = jest
      .fn()
      .mockReturnValue({ populate: mockPopulate2 });

    bookClubModel.findById.mockReturnValueOnce({
      populate: mockPopulate1,
    } as any);

    await expect(service.findOne('nonExistingId')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockPopulate1).toHaveBeenCalledWith('owner');
    expect(mockPopulate2).toHaveBeenCalledWith({
      path: 'books',
      populate: { path: 'book', model: 'Book' },
    });
  });

  it('should create a book club', async () => {
    const saveMock = jest.fn().mockResolvedValue(mockBookClub);
    const bookClubModelConstructor = jest.fn(() => ({
      save: saveMock,
    }));

    const module = await Test.createTestingModule({
      providers: [
        BookClubService,
        {
          provide: getModelToken(BookClub.name),
          useValue: Object.assign(bookClubModelConstructor, bookClubModel),
        },
        {
          provide: getModelToken(BookClubBook.name),
          useValue: {},
        },
        {
          provide: getModelToken(Membership.name),
          useValue: {},
        },
      ],
    }).compile();

    const localService = module.get<BookClubService>(BookClubService);

    const dto = { name: 'Book of the month' };
    const result = await localService.create(dto, '507f191e810c19729de860ea');
    expect(result).toEqual(mockBookClub);
    expect(saveMock).toHaveBeenCalled();
    expect(bookClubModelConstructor).toHaveBeenCalledWith({
      name: 'Book of the month',
      owner: expect.any(Types.ObjectId),
    });
  });
});
