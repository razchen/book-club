import { Injectable } from '@nestjs/common';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { BookClubService } from './book-club.service';
import { plainToInstance } from 'class-transformer';
import { BookClubSubjectDto } from './dto/book-club-subject.dto';

@Injectable()
export class BookClubHook
  implements SubjectBeforeFilterHook<BookClubSubjectDto, Request>
{
  constructor(readonly bookClubService: BookClubService) {}

  async run(
    request: Request & { params: { id?: string } },
  ): Promise<BookClubSubjectDto | undefined> {
    const id = request?.params?.id;

    if (!id) return undefined;

    const doc = await this.bookClubService.findOne(id, false);

    const bookClub = plainToInstance(BookClubSubjectDto, doc, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return bookClub;
  }
}
