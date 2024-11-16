import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities';
import { Repository } from 'typeorm';
import { QuestionErrorCodes } from './question.error-codes';
import { GraphQLError } from 'graphql/error';
import { PossibleAnswer } from './types';
import { User } from '../users/entities';
import { CurrentUserProvider } from '../users/currentUser.provider';

@Injectable()
export class QuestionService {
  constructor(
    @Inject(CurrentUserProvider)
    private readonly currentUserProvider: CurrentUserProvider,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    if (await this.hasQuestionAlreadyExist(createQuestionInput.question)) {
      throw new GraphQLError(QuestionErrorCodes.QuestionAlreadyExist, {
        extensions: {
          errorCode: QuestionErrorCodes.QuestionAlreadyExist,
        },
      });
    }

    const newQuestion: Question = this.questionRepository.create({
      ...createQuestionInput,
      user: await this.currentUserProvider.userEntity,
    });
    if (!newQuestion) {
      throw new GraphQLError(QuestionErrorCodes.CreatingQuestionFailed, {
        extensions: { errorCode: QuestionErrorCodes.CreatingQuestionFailed },
      });
    }
    return this.questionRepository.save(newQuestion);
  }

  async remove(questionId: string): Promise<Question> {
    const question = await this.findOne(questionId);
    if (!question) {
      throw new GraphQLError(QuestionErrorCodes.QuestionNotFound, {
        extensions: { errorCode: QuestionErrorCodes.QuestionNotFound },
      });
    }
    return this.questionRepository.remove(question);
  }

  async findOne(questionId: string): Promise<Question> {
    return this.questionRepository
      .createQueryBuilder('question')
      .where('question.user = :userId', {
        userId: this.currentUserProvider.userId,
      })
      .andWhere('question.id = :questionId', { questionId })
      .getOne();
  }

  async hasQuestionAlreadyExist(value: string) {
    return this.questionRepository
      .createQueryBuilder('question')
      .where('LOWER(question.question) = LOWER(:value)', { value })
      .getOne();
  }

  async checkUsersAnswer(
    questionId: string,
    usersAnswer: PossibleAnswer,
  ): Promise<boolean> {
    const question = await this.findOne(questionId);

    const { correctAnswer } = question;
    return correctAnswer === usersAnswer;
  }

  async getQuestions(): Promise<Question[]> {
    return this.questionRepository
      .createQueryBuilder('question')
      .where('question.user = :userId', {
        userId: this.currentUserProvider.userId,
      })
      .getMany();
  }
}
