import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Bookstore } from '../../bookstores/entities/bookstore.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column('text')
  description: string;

  @Column({ unique: true })
  isbn: string;

  @ManyToMany(() => Bookstore, (bookstore) => bookstore.books)
  @JoinTable()
  bookstores: Bookstore[];

  // @ManyToMany(() => Bookstore, (bookstore) => bookstore.books)
  // bookstores: Bookstore[];
}
