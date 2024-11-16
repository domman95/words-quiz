import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { UsersMutationResolver, UsersQueryResolver } from './resolvers';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
  providers: [UsersMutationResolver, UsersQueryResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
