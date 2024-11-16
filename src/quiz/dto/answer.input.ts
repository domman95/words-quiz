import { Field, InputType } from '@nestjs/graphql';
import { PossibleAnswer } from '../../question/types';

@InputType()
export class Answer {
  @Field()
  questionId: string;

  @Field(() => PossibleAnswer)
  userAnswer: PossibleAnswer;
}
