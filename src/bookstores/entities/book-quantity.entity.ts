import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Bookstore } from './bookstore.entity';

@Entity()
export class BookQuantity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book)
  book: Book;

  @ManyToOne(() => Bookstore, (bookstore) => bookstore.bookQuantities)
  bookstore: Bookstore;

  @Column()
  quantity: number;
}
