import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { QuizService } from '../quiz.service';
import { Quiz } from '../entities/quiz.entity';
import { CreateQuizInput } from '../dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

@Resolver(() => Quiz)
export class QuizMutationResolver {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Quiz)
  async createQuiz(
    @Args('createQuizInput') createQuizInput: CreateQuizInput,
  ): Promise<Quiz> {
    return this.quizService.createQuiz(createQuizInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Quiz)
  async removeQuiz(@Args('id') id: string): Promise<Quiz> {
    return this.quizService.removeQuiz(id);
  }
}
