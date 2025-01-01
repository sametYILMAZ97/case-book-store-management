import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookstore } from './entities/bookstore.entity';
import { Book } from '../books/entities/book.entity';
import { BookQuantity } from './entities/book-quantity.entity';
import { CreateBookstoreDto } from './dto/create-bookstore.dto';

@Injectable()
export class BookstoresService {
  constructor(
    @InjectRepository(Bookstore)
    private bookstoresRepository: Repository<Bookstore>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(BookQuantity)
    private bookQuantityRepository: Repository<BookQuantity>,
  ) {}

  async create(createBookstoreDto: CreateBookstoreDto): Promise<Bookstore> {
    try {
      const bookstore = this.bookstoresRepository.create(createBookstoreDto);
      return await this.bookstoresRepository.save(bookstore);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Bookstore with this name already exists');
      }
      throw new InternalServerErrorException('Error creating bookstore');
    }
  }

  async findAll(): Promise<Bookstore[]> {
    try {
      const bookstores = await this.bookstoresRepository.find({
        relations: ['bookQuantities', 'bookQuantities.book']
      });
      if (!bookstores.length) {
        throw new NotFoundException('No bookstores found');
      }
      return bookstores;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving bookstores');
    }
  }

  async findOne(id: string): Promise<Bookstore> {
    try {
      const bookstore = await this.bookstoresRepository.findOne({
        where: { id },
        relations: ['bookQuantities', 'bookQuantities.book'],
      });
      if (!bookstore) {
        throw new NotFoundException(`Bookstore with ID "${id}" not found`);
      }
      return bookstore;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Error retrieving bookstore with ID "${id}"`);
    }
  }

  async addBook(bookstoreId: string, bookId: string, quantity: number): Promise<Bookstore> {
    try {
      if (quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      const bookstore = await this.findOne(bookstoreId);
      const book = await this.booksRepository.findOne({ where: { id: bookId } });

      if (!book) {
        throw new NotFoundException(`Book with ID "${bookId}" not found`);
      }

      let bookQuantity = await this.bookQuantityRepository.findOne({
        where: { bookstore: { id: bookstoreId }, book: { id: bookId } },
      });

      if (bookQuantity) {
        bookQuantity.quantity += quantity;
      } else {
        bookQuantity = this.bookQuantityRepository.create({
          book,
          bookstore,
          quantity,
        });
      }

      await this.bookQuantityRepository.save(bookQuantity);
      return this.findOne(bookstoreId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error adding book to bookstore');
    }
  }

  async removeBook(bookstoreId: string, bookId: string, quantity: number): Promise<Bookstore> {
    try {
      if (quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      const bookstore = await this.findOne(bookstoreId);
      const bookQuantity = await this.bookQuantityRepository.findOne({
        where: { bookstore: { id: bookstoreId }, book: { id: bookId } },
      });

      if (!bookQuantity) {
        throw new NotFoundException(`Book with ID "${bookId}" not found in bookstore`);
      }

      if (bookQuantity.quantity < quantity) {
        throw new BadRequestException('Not enough books in stock');
      }

      bookQuantity.quantity -= quantity;

      if (bookQuantity.quantity === 0) {
        await this.bookQuantityRepository.remove(bookQuantity);
      } else {
        await this.bookQuantityRepository.save(bookQuantity);
      }

      return this.findOne(bookstoreId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error removing book from bookstore');
    }
  }
}
