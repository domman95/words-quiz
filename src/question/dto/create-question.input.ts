import { InputType, Field } from '@nestjs/graphql';
import { PossibleAnswer } from '../types';
@InputType()
export class CreateQuestionInput {
  @Field()
  question: string;

  @Field()
  answer1: string;

  @Field()
  answer2: string;

  @Field()
  answer3: string;

  @Field(() => PossibleAnswer)
  correctAnswer: PossibleAnswer;
}
