import { Module } from '@nestjs/common';
import { JWTDataService } from './jwt.data-service';
import { PassportModule } from '../passport/passport.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, JwtModule],
  providers: [JWTDataService],
  exports: [JWTDataService],
})
export class JWTModule {}
