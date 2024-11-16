import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuestionService } from '../question/question.service';
import { Question } from '../question/entities';
import { GraphQLError } from 'graphql/error';
import { QuizErrorCodes } from './quiz.error-codes';
import { Answer, CreateQuizInput } from './dto';
import { User } from '../users/entities';
import { CurrentUserProvider } from '../users/currentUser.provider';

@Injectable()
export class QuizService {
  constructor(
    @Inject(CurrentUserProvider)
    private readonly currentUserProvider: CurrentUserProvider,
    @InjectRepository(Quiz) private quizRepository: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @Inject(QuestionService) private readonly questionService: QuestionService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createQuiz(createQuizInput: CreateQuizInput): Promise<Quiz> {
    const user = await this.currentUserProvider.userEntity;

    const questions = await this.questionRepository
      .createQueryBuilder('question')
      .where('question.user = :userId', { userId: user.id })
      .distinct(true)
      .orderBy('RAND()')
      .limit(createQuizInput.questionCount)
      .getMany();

    const quiz = new Quiz();
    quiz.quizName = createQuizInput.quizName;
    quiz.questions = questions;
    quiz.user = user;

    return this.quizRepository.save(quiz);
  }

  async getQuiz(quizId: string): Promise<Quiz> {
    return this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'question')
      .where('quiz.id = :quizId', { quizId })
      .andWhere('quiz.user = :userId', {
        userId: this.currentUserProvider.userId,
      })
      .getOne();
  }

  async removeQuiz(quizId: string): Promise<Quiz> {
    const quiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .where('quiz.id = :quizId', { quizId })
      .andWhere('quiz.user = :userId', {
        userId: this.currentUserProvider.userId,
      })
      .getOne();

    if (!quiz) {
      throw new GraphQLError(QuizErrorCodes.QuizNotFound, {
        extensions: { errorCode: QuizErrorCodes.QuizNotFound },
      });
    }

    await this.quizRepository
      .createQueryBuilder()
      .relation(Quiz, 'questions')
      .of(quiz)
      .remove(quiz.questions);

    return this.quizRepository.remove(quiz);
  }

  async checkQuiz(quizId: string, answers: Answer[]): Promise<string> {
    const quiz = await this.getQuiz(quizId);
    const { questions } = quiz;
    const quizLength = questions.length;
    const userAnswersLength = answers.length;

    if (quizLength !== userAnswersLength) {
      throw new GraphQLError(
        QuizErrorCodes.ProvidedQuizIdDoesNotMatchWithAnswers,
        {
          extensions: {
            errorCode: QuizErrorCodes.ProvidedQuizIdDoesNotMatchWithAnswers,
          },
        },
      );
    }

    const correctAnswers = questions.reduce((correctCount, correct) => {
      const userAnswer = answers.find(
        ({ questionId }) => questionId === correct.id,
      );

      if (userAnswer && userAnswer.userAnswer === correct.correctAnswer) {
        correctCount++;
      }

      return correctCount;
    }, 0);

    const percentageOfCorrectAnswers = (correctAnswers / quizLength) * 100;

    return percentageOfCorrectAnswers.toFixed(2);
  }

  async getQuizzes(): Promise<Quiz[]> {
    return this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'question')
      .where('quiz.user = :userId', { userId: this.currentUserProvider.userId })
      .getMany();
  }
}
