import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  Column,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Question } from '../../question/entities';
import { User } from '../../users/entities';

@ObjectType()
@Entity('quiz')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  @Field({ nullable: true })
  id: string;

  @Field()
  @Column()
  quizName: string;

  @ManyToMany(() => Question, (question) => question.quizzes)
  @JoinTable()
  @Field(() => [Question])
  questions: Question[];

  @ManyToOne(() => User, (user) => user.quizzes, { onDelete: 'CASCADE' })
  user: User;
}
