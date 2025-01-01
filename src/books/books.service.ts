import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const book = this.booksRepository.create(createBookDto);
      return await this.booksRepository.save(book);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Book with this ISBN already exists');
      }
      throw new InternalServerErrorException('Error creating book');
    }
  }

  async findAll(): Promise<Book[]> {
    try {
      const books = await this.booksRepository.find();
      if (!books.length) {
        throw new NotFoundException('No books found');
      }
      return books;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving books');
    }
  }

  async findOne(id: string): Promise<Book> {
    try {
      const book = await this.booksRepository.findOne({ where: { id } });
      if (!book) {
        throw new NotFoundException(`Book with ID "${id}" not found`);
      }
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error retrieving book with ID "${id}"`);
    }
  }

  async update(id: string, updateBookDto: any): Promise<Book> {
    try {
      const book = await this.findOne(id);
      const updatedBook = Object.assign(book, updateBookDto);
      return await this.booksRepository.save(updatedBook);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Book with this ISBN already exists');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error updating book with ID "${id}"`);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const book = await this.findOne(id);
      await this.booksRepository.remove(book);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error deleting book with ID "${id}"`);
    }
  }
}
