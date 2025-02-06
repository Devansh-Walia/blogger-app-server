import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsService } from './posts.service';
import { UsersService } from '../users/users.service';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { expect, jest } from '@jest/globals';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let usersService: UsersService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    provider: 'google',
    posts: [],
  };

  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            create: jest.fn().mockReturnValue(mockPost),
            save: jest.fn().mockResolvedValue(mockPost as never),
            find: jest.fn().mockResolvedValue([mockPost] as never),
            findOne: jest.fn().mockResolvedValue(mockPost as never),
            remove: jest.fn().mockResolvedValue(undefined as never),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser as never),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto = {
        title: 'Test Post',
        content: 'Test Content',
        userId: 1,
      };

      const result = await service.create(createPostDto);

      expect(result).toEqual(mockPost);
      expect(usersService.findOne).toHaveBeenCalledWith(createPostDto.userId);
      expect(postRepository.create).toHaveBeenCalled();
      expect(postRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      const createPostDto = {
        title: 'Test Post',
        content: 'Test Content',
        userId: 999,
      };

      await expect(service.create(createPostDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await service.findAll(10, 0);
      expect(result).toEqual([mockPost]);
      expect(postRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(mockPost);
      expect(postRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if post not found', async () => {
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        userId: 1,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPost);

      const result = await service.update(1, updatePostDto);
      expect(result).toEqual(mockPost);
      expect(postRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPost);

      await service.remove(1);
      expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('findByUser', () => {
    it('should return posts for a user', async () => {
      const result = await service.findByUser(1);
      expect(result).toEqual([mockPost]);
      expect(usersService.findOne).toHaveBeenCalledWith(1);
      expect(postRepository.find).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(new NotFoundException());
      await expect(service.findByUser(999)).rejects.toThrow(NotFoundException);
    });
  });
});
