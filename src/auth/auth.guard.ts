import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { GraphQLError } from 'graphql/error';
import { AuthErrorCodes } from './auth.error-codes';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new GraphQLError(AuthErrorCodes.Unauthorized, {
        extensions: {
          errorCode: AuthErrorCodes.Unauthorized,
        },
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'testSecret',
      });
      request['user'] = payload;
    } catch {
      throw new GraphQLError(AuthErrorCodes.Unauthenticated, {
        extensions: {
          errorCode: AuthErrorCodes.Unauthenticated,
        },
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
