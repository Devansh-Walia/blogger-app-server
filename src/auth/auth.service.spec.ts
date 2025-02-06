import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { expect, jest } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    posts: [],
    provider: 'jest',
  };

  const mockJwtToken = 'mock-jwt-token';
  const mockJwtSecret = 'test-secret';
  const mockJwtExpiration = '1h';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockJwtToken),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return mockJwtSecret;
                case 'JWT_EXPIRATION':
                  return mockJwtExpiration;
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user info', async () => {
      const result = await service.login(mockUser);

      expect(result).toEqual({
        access_token: mockJwtToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith(
        { email: mockUser.email, sub: mockUser.id },
        {
          secret: mockJwtSecret,
          expiresIn: mockJwtExpiration,
        },
      );
    });
  });

  describe('validateUser', () => {
    const payload = {
      email: 'test@example.com',
      sub: 1,
    };

    it('should return the payload', async () => {
      const result = await service.validateUser(payload);
      expect(result).toEqual(payload);
    });
  });
});
