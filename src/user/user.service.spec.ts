import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userModel: jest.Mocked<Model<any>>;

  const mockUser = {
    _id: '507f191e810c19729de860ea',
    name: 'Roo Man',
    email: 'roo@man.com',
    password: '1234',
    roles: ['user'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
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

    service = module.get<UserService>(UserService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should return all users', async () => {
    userModel.find.mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue([mockUser]),
    } as any);

    const users = await service.findAll();
    expect(users).toEqual([mockUser]);
    expect(userModel.find).toHaveBeenCalled();
  });

  it('should return one user by id', async () => {
    userModel.findById.mockResolvedValueOnce(mockUser as any);

    const user = await service.findOne('507f191e810c19729de860ea');
    expect(user).toEqual(mockUser);
  });

  it('should throw if user was not found', async () => {
    userModel.findById.mockResolvedValueOnce(null);

    await expect(service.findOne('notfoundid')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a user', async () => {
    const saveMock = jest.fn().mockResolvedValue(mockUser);
    const userModelConstructor = jest.fn(() => ({
      save: saveMock,
    }));

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Object.assign(userModelConstructor, userModel),
        },
      ],
    }).compile();

    const localService = module.get<UserService>(UserService);

    const dto = { name: 'Roo Man', email: 'roo@man.com', password: '1234' };
    const result = await localService.create(dto);
    expect(result).toEqual(mockUser);
    expect(saveMock).toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const updatedUser = { ...mockUser, name: 'avi' };

    userModel.findByIdAndUpdate.mockResolvedValueOnce(updatedUser as any);

    const updated = await service.update('507f191e810c19729de860ea', {
      name: 'avi',
    });

    console.log('updatedUser', updatedUser);
    console.log('updated', updated);

    expect(updated).toEqual(updatedUser);
  });

  it('should throw when updating nonexistent user', async () => {
    userModel.findByIdAndUpdate.mockResolvedValueOnce(null);
    await expect(service.update('nonexitingid', mockUser)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete a user', async () => {
    userModel.findById.mockResolvedValueOnce(mockUser);
    userModel.findByIdAndDelete.mockResolvedValueOnce(mockUser);

    const result = await service.delete('507f191e810c19729de860ea');
    expect(result).toEqual({
      message: 'User deleted',
      code: 204,
    });
  });

  it('should throw when deleting nonexistent user', async () => {
    userModel.findById.mockResolvedValueOnce(null);
    await expect(service.delete('badid')).rejects.toThrow(NotFoundException);
  });
});
