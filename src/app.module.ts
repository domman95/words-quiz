import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './database/data-source';
import { QuestionModule } from './question/question.module';
import { QuizModule } from './quiz/quiz.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CurrentUserProvider } from './users/currentUser.provider';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    QuestionModule,
    QuizModule,
    UsersModule,
    AuthModule,
  ],
  providers: [QuestionModule, CurrentUserProvider],
  exports: [CurrentUserProvider],
})
export class AppModule {}
