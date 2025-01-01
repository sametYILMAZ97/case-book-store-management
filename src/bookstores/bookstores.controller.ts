import { Controller, Get, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { BookstoresService } from './bookstores.service';
import { CreateBookstoreDto } from './dto/create-bookstore.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('bookstores')
export class BookstoresController {
  constructor(private readonly bookstoresService: BookstoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createBookstoreDto: CreateBookstoreDto) {
    return this.bookstoresService.create(createBookstoreDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.bookstoresService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.bookstoresService.findOne(id);
  }

  @Put(':id/add-book/:bookId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STORE_MANAGER, Role.ADMIN)
  addBook(@Param('id') id: string, @Param('bookId') bookId: string, @Body('quantity') quantity: number) {
    return this.bookstoresService.addBook(id, bookId, quantity);
  }

  @Put(':id/remove-book/:bookId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.STORE_MANAGER, Role.ADMIN)
  removeBook(@Param('id') id: string, @Param('bookId') bookId: string, @Body('quantity') quantity: number) {
    return this.bookstoresService.removeBook(id, bookId, quantity);
  }
}
