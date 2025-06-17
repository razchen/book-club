import { Permissions, Actions } from 'nest-casl';
import { InferSubjects } from '@casl/ability';

import { Roles } from '../app.roles';
import { UserDto } from './dto/user.dto';

export type Subjects = InferSubjects<typeof UserDto>;

export const permissions: Permissions<Roles, Subjects, Actions> = {
  admin({ can }) {
    can(Actions.manage, UserDto);
  },
};
