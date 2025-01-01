import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Role } from '../common/enums/role.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'password123',
        role: Role.USER,
      };

      const savedUser = { ...createUserDto, id: '1' };
      mockRepository.create.mockReturnValue(createUserDto);
      mockRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(savedUser);
    });

    it('should throw ConflictException when username exists', async () => {
      mockRepository.save.mockRejectedValue({ code: '23505' });

      await expect(service.create({ username: 'existing', password: 'test', role: Role.USER })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: '1', username: 'test' };
      mockRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('test');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
