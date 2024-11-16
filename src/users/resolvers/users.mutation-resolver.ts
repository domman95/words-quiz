import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from '../users.service';
import { User } from '../entities';
import { UserInput } from '../dto/createUser.input';

@Resolver(() => User)
export class UsersMutationResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async create(@Args('user') user: UserInput): Promise<User> {
    return this.usersService.create(user);
  }
}
