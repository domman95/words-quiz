import { Resolver, Query, Args, registerEnumType } from '@nestjs/graphql';
import { QuestionService } from '../question.service';
import { Question } from '../entities';
import { PossibleAnswer } from '../types';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

registerEnumType(PossibleAnswer, {
  name: 'PossibleAnswer',
});

@Resolver(() => Question)
export class QuestionQueryResolver {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(AuthGuard)
  @Query(() => Boolean)
  async checkUsersAnswer(
    @Args('id') id: string,
    @Args('usersAnswer', { type: () => PossibleAnswer })
    usersAnswer: PossibleAnswer,
  ): Promise<boolean> {
    return this.questionService.checkUsersAnswer(id, usersAnswer);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Question])
  async getQuestions(): Promise<Question[]> {
    return this.questionService.getQuestions();
  }
}
