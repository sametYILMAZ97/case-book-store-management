import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookstoresService } from './bookstores.service';
import { BookstoresController } from './bookstores.controller';
import { Bookstore } from './entities/bookstore.entity';
import { Book } from '../books/entities/book.entity';
import { BookQuantity } from './entities/book-quantity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookstore, Book, BookQuantity])],
  providers: [BookstoresService],
  controllers: [BookstoresController],
})
export class BookstoresModule {}
