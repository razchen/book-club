import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  BookClub,
  BookClubDocument,
} from 'src/book-club/schema/book-club.schema';
import { JwtPayload } from 'src/types/Auth';
import { User } from 'src/user/schema/user.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof BookClub>
  | InferSubjects<typeof User>
  | 'all';
type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @InjectModel(BookClub.name) private bookClubModel: Model<BookClubDocument>,
  ) {}

  createForUser(user: JwtPayload) {
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );

    const ownerId = new Types.ObjectId(user.id);

    // Users
    can(Action.Read, this.bookClubModel, { owner: ownerId });
    can([Action.Update, Action.Delete], this.bookClubModel, { owner: ownerId });

    // Admins
    if (user.role === 'admin') {
      can(Action.Manage, 'all');
    }

    return build({
      detectSubjectType: (item) => {
        return item.constructor as ExtractSubjectType<Subjects>;
      },
    });
  }
}
