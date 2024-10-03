import { Module } from '@nestjs/common';
import { AccessTokenStrategy } from './accessToken.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';

@Module({
  imports: [],
  controllers: [],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AccessTokenStrategy, RefreshTokenStrategy],
})
export class PassportModule {}
