import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { JWT } from './auth.object-type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => JWT)
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(email, password);
  }
}
