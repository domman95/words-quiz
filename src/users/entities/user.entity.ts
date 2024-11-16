import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../question/entities";
import { Quiz } from "../../quiz/entities/quiz.entity";

@ObjectType()
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  displayName: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Quiz, (quiz) => quiz.user)
  quizzes: Quiz[];
}
