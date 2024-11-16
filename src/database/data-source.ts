import { DataSource, DataSourceOptions } from 'typeorm';
import { Question as QuestionEntity } from '../question/entities/question.entity';
import { Quiz as QuizEntity } from '../quiz/entities/quiz.entity';
import { User as UserEntity } from '../users/entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3316,
  username: 'root',
  password: 'admin',
  database: 'words_quiz',
  entities: [QuestionEntity, QuizEntity, UserEntity],
  synchronize: false,
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
};

export const dataSource = new DataSource(dataSourceOptions);
