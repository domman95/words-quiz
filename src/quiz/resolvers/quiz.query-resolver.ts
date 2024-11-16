import { Args, Query, Resolver } from '@nestjs/graphql';
import { QuizService } from '../quiz.service';
import { Quiz } from '../entities/quiz.entity';
import { Answer } from '../dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

@Resolver(() => Quiz)
export class QuizQueryResolver {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(AuthGuard)
  @Query(() => Quiz)
  async getQuiz(@Args('id') id: string): Promise<Quiz> {
    return this.quizService.getQuiz(id);
  }

  @UseGuards(AuthGuard)
  @Query(() => String)
  async checkQuiz(
    @Args('quizId') quizId: string,
    @Args('answers', { type: () => [Answer] }) answers: Answer[],
  ): Promise<string> {
    return this.quizService.checkQuiz(quizId, answers);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Quiz])
  async getQuizzes(): Promise<Quiz[]> {
    return this.quizService.getQuizzes();
  }
}
