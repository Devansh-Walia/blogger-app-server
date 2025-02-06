import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const oldUser = this.userRepository.findOne({
      where: {
        ...createUserDto,
      },
    });

    if (oldUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  findAll(limit: number, offset: number): Promise<[User[], number]> {
    return this.userRepository.findAndCount({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<string> {
    const user = await this.findOne(id);

    await this.userRepository.remove(user);

    return 'User deleted successfully';
  }

  findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
