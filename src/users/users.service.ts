import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInput } from './dto/createUser.input';
import { AuthService } from '../auth/auth.service';
import { GraphQLError } from 'graphql/error';
import { UsersErrorCodes } from './users.error-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async create(user: UserInput): Promise<any> {
    if (await this.isEmailAlreadyExist(user.email)) {
      throw new GraphQLError(UsersErrorCodes.UserEmailAlreadyExist, {
        extensions: { errorCode: UsersErrorCodes.UserEmailAlreadyExist },
      });
    }

    if (await this.isDisplayNameAlreadyExist(user.displayName)) {
      throw new GraphQLError(UsersErrorCodes.UserDisplayNameAlreadyExist, {
        extensions: { errorCode: UsersErrorCodes.UserDisplayNameAlreadyExist },
      });
    }

    const hashedPassword = await this.authService.hashPassword(user.password);
    const newUser: User = {
      ...user,
      password: hashedPassword,
    } as User;
    return this.usersRepository.save(newUser);
  }
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async isEmailAlreadyExist(email: string): Promise<boolean> {
    return Boolean(await this.findOneByEmail(email));
  }

  async isDisplayNameAlreadyExist(displayName: string): Promise<boolean> {
    return Boolean(
      await this.usersRepository.findOne({ where: { displayName } }),
    );
  }

  async getUser(userId: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
