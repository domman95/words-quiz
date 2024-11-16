import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { QuestionService } from '../question.service';
import { Question } from '../entities';
import { CreateQuestionInput } from '../dto/create-question.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

@Resolver(() => Question)
export class QuestionMutationResolver {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Question)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    return this.questionService.create(createQuestionInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Question)
  async removeQuestion(@Args('id') id: string): Promise<Question> {
    return this.questionService.remove(id);
  }
}
