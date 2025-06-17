import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schema/book.schema';
import { CaslModule } from 'nest-casl';
import { permissions } from './book.permission';

@Module({
  controllers: [BookController],
  providers: [BookService],
  imports: [
    CaslModule.forFeature({ permissions }),
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
})
export class BookModule {}
