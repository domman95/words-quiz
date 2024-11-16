import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from '../users.service';
import { User } from '../entities';

@Resolver(() => User)
export class UsersQueryResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOneByEmail(email: string): Promise<User> {
    return this.usersService.findOneByEmail(email);
  }
}
