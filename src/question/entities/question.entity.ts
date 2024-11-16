import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { PossibleAnswer } from '../types';
import { User } from '../../users/entities';

@ObjectType()
@Entity('question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  @Field({ nullable: true })
  id: string;

  @Column()
  @Field()
  question: string;

  @Column()
  @Field()
  answer1: string;

  @Column()
  @Field()
  answer2: string;

  @Column()
  @Field()
  answer3: string;

  @Column()
  @Field(() => PossibleAnswer)
  correctAnswer: PossibleAnswer;

  @ManyToMany(() => Quiz, (quiz) => quiz.questions)
  quizzes: Quiz[];

  @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
  user: User;
}
