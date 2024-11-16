import { Inject, Injectable, Scope, Req } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { UsersService } from './users.service';
import { User } from './entities';

@Injectable({ scope: Scope.REQUEST })
export class CurrentUserProvider {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  get userId(): string {
    return this.request.req.user?.sub;
  }

  get userEntity(): Promise<User> {
    return this.usersService.getUser(this.userId);
  }
}
