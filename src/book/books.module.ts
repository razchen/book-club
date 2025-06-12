import { Module } from '@nestjs/common';
import { BooksController } from './book.controller';
import { BooksService } from './books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schema/book.schema';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
})
export class BooksModule {}
