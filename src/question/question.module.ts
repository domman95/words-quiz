import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities';
import { QuestionMutationResolver, QuestionQueryResolver } from './resolvers';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities';
import { CurrentUserProvider } from '../users/currentUser.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User]), UsersModule],
  providers: [
    QuestionQueryResolver,
    QuestionMutationResolver,
    QuestionService,
    CurrentUserProvider,
  ],
  exports: [QuestionService],
})
export class QuestionModule {}
