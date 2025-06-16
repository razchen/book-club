import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookClubsService } from './book-clubs.service';
import { CreateBookClubDto } from './dto/create-book-club.dto';
import { UpdateBookClubDto } from './dto/update-book-club.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/types/Auth';
import { Action, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CheckAbility } from 'src/casl/check-ability.decorator';
import { getBookClubHook } from './get-book-club.hook';

@Controller('book-clubs')
@UseGuards(JwtAuthGuard)
export class BookClubsController {
  constructor(
    private readonly bookClubsService: BookClubsService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateBookClubDto,
    @Request() req: RequestWithUser,
  ) {
    const userId: string = req.user.id;
    return this.bookClubsService.create(dto, userId);
  }

  @Get()
  async findAll() {
    return this.bookClubsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookClubsService.findOne(id);
  }

  @Patch(':id')
  @CheckAbility({
    action: Action.Update,
    subject: 'BookClub',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateBookClubDto,
    @Request() req: RequestWithUser,
  ) {
    const bookClub = await this.bookClubsService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Update, bookClub)) {
      throw new ForbiddenException('You do not have the permission');
    }

    return this.bookClubsService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: RequestWithUser) {
    const bookClub = await this.bookClubsService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Delete, bookClub)) {
      throw new ForbiddenException('You do not have this permission');
    }

    return this.bookClubsService.delete(id);
  }

  @Post(':id/add-book/:bookId')
  async addBook(
    @Param('id') id: string,
    @Param('bookId') bookId: string,
    @Request() req: RequestWithUser,
  ) {
    const bookClub = await this.bookClubsService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Update, bookClub)) {
      throw new ForbiddenException('You do not have this permission');
    }

    return await this.bookClubsService.addBook(id, bookId);
  }

  @Delete(':id/remove-book/:bookId')
  async removeBook(
    @Param('id') id: string,
    @Param('bookId') bookId: string,
    @Request() req: RequestWithUser,
  ) {
    const bookClub = await this.bookClubsService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(req.user);
    if (!ability.can(Action.Update, bookClub)) {
      throw new ForbiddenException('You do not have this permission');
    }

    return await this.bookClubsService.removeBook(id, bookId);
  }

  @Post(':id/add-user')
  async addUser(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.id;
    return await this.bookClubsService.addUser(id, userId);
  }

  @Delete(':id/remove-user')
  async removeUser(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId: string = req.user.id;
    return await this.bookClubsService.removeUser(id, userId);
  }
}
