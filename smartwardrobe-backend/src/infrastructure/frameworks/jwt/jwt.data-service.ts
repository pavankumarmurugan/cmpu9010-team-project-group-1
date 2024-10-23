import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JWTDataService {
  constructor(private jwtService: JwtService) {}

  async generateToken(userId: number, role: string): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        data: { role },
      },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      },
    );
  }

  async generateRefreshToken(userId: number): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      },
    );
  }

  // async verifyToken(token: string) {}
}
