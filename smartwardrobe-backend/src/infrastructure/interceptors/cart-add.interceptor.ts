import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { IDataServices } from 'src/core/abstracts';

@Injectable()
export class CartCreateInterceptor implements NestInterceptor {
  constructor(private databaseService: IDataServices) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { user } = context.switchToHttp().getRequest();
    const userId = user ? user.userId : null;
    return next.handle().pipe(
      tap(async (response) => {
        const id = userId !== null ? userId : response['data']['userId'];
        await this.databaseService.cart.create({ userId: id });
      }),
    );
  }
}
