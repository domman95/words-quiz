import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuizInput {
  @Field()
  quizName: string;

  @Field()
  questionCount: number;
}
