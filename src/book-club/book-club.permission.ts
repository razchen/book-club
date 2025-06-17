import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

import { Roles } from '../app.roles';
import { BookClubDto } from './dto/book-club.dto';
import { BookClubSubjectDto } from './dto/book-club-subject.dto';

export type Subjects = InferSubjects<typeof BookClubDto>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  everyone({ can }) {
    can(Actions.read, BookClubDto);
  },

  user({ user, can }) {
    can(Actions.create, BookClubDto);

    can([Actions.update, Actions.delete], BookClubSubjectDto, {
      owner: user.id,
    });
  },
};
