import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    const values = {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION'),
      }),
      user: {
        id: user.id,
        email: user.email,
      },
    };

    return values;
  }

  async validateUser(payload: any): Promise<any> {
    return payload;
  }
}
