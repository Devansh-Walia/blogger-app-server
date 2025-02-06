import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { expect, jest } from '@jest/globals';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    provider: 'google',
    posts: [],
  };

  const mockAuthResponse = {
    access_token: 'mock-jwt-token',
    user: {
      id: mockUser.id,
      email: mockUser.email,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(mockAuthResponse as never),
            validateOAuthLogin: jest.fn().mockResolvedValue(mockUser as never),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuth', () => {
    it('should initiate Google OAuth', () => {
      expect(controller.googleAuth()).toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should handle successful Google OAuth callback', async () => {
      const req = {
        user: mockUser,
      };

      const result = await controller.googleAuthCallback(req);
      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('facebookAuth', () => {
    it('should initiate Facebook OAuth', () => {
      expect(controller.facebookAuth()).toBeUndefined();
    });
  });

  describe('facebookAuthRedirect', () => {
    it('should handle successful Facebook OAuth callback', async () => {
      const req = {
        user: mockUser,
      };

      const result = await controller.facebookAuthCallback(req);
      expect(result).toEqual(mockAuthResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
