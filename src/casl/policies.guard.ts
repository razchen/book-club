import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from './check-policies.decorator';
import { Reflector } from '@nestjs/core';
import { RequestWithUser } from 'src/types/Auth';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const handlers = this.reflector.get<PolicyHandler[]>(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const ability = this.caslAbilityFactory.createForUser(user);

    const isAllowed = handlers.every((handler) => handler(ability));

    if (!isAllowed) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
