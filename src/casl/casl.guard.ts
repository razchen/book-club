import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import {
  CHECK_ABILITY_KEY,
  AbilityRequirement,
} from 'src/casl/check-ability.decorator';
import { RequestWithUser } from 'src/types/Auth';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const handlerReqs =
      this.reflector.get<AbilityRequirement[]>(
        CHECK_ABILITY_KEY,
        ctx.getHandler(),
      ) || [];

    if (!handlerReqs.length) return true; // no ability metadata → allow

    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const ability = this.abilityFactory.createForUser(request.user);

    // evaluate every requirement attached to this route
    for (const { action, subject, hook } of handlerReqs) {
      const target = hook ? await hook(request) : subject;

      if (!ability.can(action, target)) {
        throw new ForbiddenException('You do not have permission');
      }
    }
    return true;
  }
}
