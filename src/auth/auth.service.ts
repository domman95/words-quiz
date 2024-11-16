import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql/error';
import { AuthErrorCodes } from './auth.error-codes';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new GraphQLError(AuthErrorCodes.InvalidEmail, {
        extensions: { errorCode: AuthErrorCodes.InvalidEmail },
      });
    }

    const validPassword = await this.verify(password, user.password);

    if (!validPassword) {
      throw new GraphQLError(AuthErrorCodes.Unauthorized, {
        extensions: { errorCode: AuthErrorCodes.Unauthorized },
      });
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async hashPassword(userPassword: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(userPassword, salt);
  }

  async verify(password, storedPassword) {
    return bcrypt.compare(password, storedPassword);
  }
}
