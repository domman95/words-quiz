import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
  @Field()
  displayName: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
