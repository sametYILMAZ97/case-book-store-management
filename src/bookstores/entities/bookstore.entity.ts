import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { BookQuantity } from './book-quantity.entity';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class Bookstore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany(() => BookQuantity, (bookQuantity) => bookQuantity.bookstore)
  bookQuantities: BookQuantity[];

  @ManyToMany(() => Book, (book) => book.bookstores)
  books: Book[];
}
