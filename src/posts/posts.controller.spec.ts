import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { expect, jest } from '@jest/globals';

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;

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
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPost as never),
            findAll: jest.fn().mockResolvedValue([mockPost] as never),
            findOne: jest.fn().mockResolvedValue(mockPost as never),
            update: jest.fn().mockResolvedValue(mockPost as never),
            remove: jest.fn().mockResolvedValue(undefined as never),
            findByUser: jest.fn().mockResolvedValue([mockPost] as never),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto = {
        title: 'Test Post',
        content: 'Test Content',
        userId: 1,
      };

      const req = {
        user: { id: 1 },
      };

      const result = await controller.create(createPostDto, req);
      expect(result).toEqual(mockPost);
      expect(postsService.create).toHaveBeenCalledWith({
        ...createPostDto,
        userId: req.user.id,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await controller.findAll(10, 0);
      expect(result).toEqual([mockPost]);
      expect(postsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockPost);
      expect(postsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
        userId: 1,
      };

      const result = await controller.update('1', updatePostDto);
      expect(result).toEqual(mockPost);
      expect(postsService.update).toHaveBeenCalledWith(1, updatePostDto);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      await controller.remove('1');
      expect(postsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findByUser', () => {
    it('should return posts for a user', async () => {
      const result = await controller.findByUser('1');
      expect(result).toEqual([mockPost]);
      expect(postsService.findByUser).toHaveBeenCalledWith(1);
    });
  });
});
