import { Module } from '@nestjs/common';
import { BooksController } from './book.controller';
import { BooksService } from './books.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schema/book.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './book.permission';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [
    CaslModule.forFeature({ permissions }),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
})
export class BooksModule {}
