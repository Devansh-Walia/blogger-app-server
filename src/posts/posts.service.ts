import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.usersService.findOne(createPostDto.userId);

    const post = this.postRepository.create({
      ...createPostDto,
      user,
    });

    return this.postRepository.save(post);
  }

  async findAll(limit: number, offset: number): Promise<[Post[], number]> {
    return this.postRepository.findAndCount({
      relations: ['user'],
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);

    if (updatePostDto.userId) {
      const user = await this.usersService.findOne(updatePostDto.userId);

      post.user = user;
    }

    Object.assign(post, updatePostDto);

    return this.postRepository.save(post);
  }

  async remove(id: number): Promise<string> {
    const post = await this.findOne(id);

    await this.postRepository.remove(post);

    return 'Post deleted successfully';
  }

  async findByUser(userId: number): Promise<Post[]> {
    await this.usersService.findOne(userId);

    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
