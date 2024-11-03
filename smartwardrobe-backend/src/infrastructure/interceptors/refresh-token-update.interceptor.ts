import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable, lastValueFrom } from 'rxjs';
import { IDataServices } from 'src/core/abstracts';
import { UserDtoConvertor } from 'src/core/convertors/user/user-dto.convertor';
import { UserEntity } from 'src/core/entities/user/user.entity';
import { BcryptService } from '../frameworks/bcrypt/bcrypt.service';

@Injectable()
export class RefreshTokenUpdateInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RefreshTokenUpdateInterceptor.name);

  constructor(
    private readonly databaseService: IDataServices,
    private readonly userDtoConvertor: UserDtoConvertor,
    private readonly bcryptService: BcryptService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const { user } = context.switchToHttp().getRequest();
    const userId = user?.userId;

    try {
      const responseObservable = next.handle();
      const response = await lastValueFrom(responseObservable);

      const refreshToken = response?.data?.refreshToken;
      const id = userId ?? response?.data?.userId;

      if (!refreshToken || !id) {
        this.logger.debug('Missing refreshToken or userId, skipping update');
        return responseObservable;
      }

      try {
        const hashRefreshToken = await this.bcryptService.hash(refreshToken);
        const updateEntity: UserEntity =
          this.userDtoConvertor.toUserLoginEntityForUpdateRefreshToken(
            hashRefreshToken,
          );

        await this.databaseService.users.update(id, updateEntity);
      } catch (error) {
        this.logger.error(
          `Failed to update refresh token: ${error.message}`,
          error.stack,
        );
      }
      return new Observable((subscriber) => {
        subscriber.next(response);
        subscriber.complete();
      });
    } catch (error) {
      this.logger.error(`Interceptor error: ${error.message}`, error.stack);
      return next.handle();
    }
  }
}
