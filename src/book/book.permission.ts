import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

import { Roles } from '../app.roles';
import { BookDto } from './dto/book.dto';

export type Subjects = InferSubjects<typeof BookDto>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  admin({ can }) {
    can(Actions.manage, BookDto);
  },
  user({ can, cannot }) {
    can([Actions.read], BookDto);
    cannot([Actions.delete, Actions.update, Actions.create], BookDto);
  },
};
