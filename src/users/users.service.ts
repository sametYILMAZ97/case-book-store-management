import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private adminCreated = false;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async createInitialAdmin(createUserDto: CreateUserDto): Promise<User> {
    try {
      if (this.adminCreated) {
        throw new ConflictException('Admin user already exists');
      }

      const adminUser = await this.create({
        ...createUserDto,
        role: Role.ADMIN,
      });

      this.adminCreated = true;
      return adminUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating admin user');
    }
  }

  async findOne(username: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { username } });
      if (!user) {
        throw new NotFoundException(`User "${username}" not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error retrieving user "${username}"`);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.usersRepository.find();
      if (!users.length) {
        throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving users');
    }
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    try {
      const user = await this.findOne(id);
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      const updatedUser = Object.assign(user, updateUserDto);
      return await this.usersRepository.save(updatedUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error updating user with ID "${id}"`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.usersRepository.remove(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error deleting user with ID "${id}"`);
    }
  }
}
