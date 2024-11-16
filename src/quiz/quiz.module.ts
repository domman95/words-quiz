import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizQueryResolver, QuizMutationResolver } from './resolvers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from '../question/entities';
import { QuestionModule } from '../question/question.module';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities';
import { CurrentUserProvider } from '../users/currentUser.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz, Question, User]),
    QuestionModule,
    UsersModule,
  ],
  providers: [
    QuizQueryResolver,
    QuizMutationResolver,
    QuizService,
    CurrentUserProvider,
  ],
})
export class QuizModule {}
