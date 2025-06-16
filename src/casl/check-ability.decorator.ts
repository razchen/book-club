import { SetMetadata } from '@nestjs/common';
import { Action } from './casl-ability.factory';

export const CHECK_ABILITY_KEY = 'check_ability';

export interface AbilityRequirement {
  action: Action;
  subject: any; // class | string
  hook?: (req: any) => any; // optional: fetch instance for instance-level checks
}

/** Attach one or more ability requirements to a route handler */
export const CheckAbility = (...abilities: AbilityRequirement[]) =>
  SetMetadata(CHECK_ABILITY_KEY, abilities);
