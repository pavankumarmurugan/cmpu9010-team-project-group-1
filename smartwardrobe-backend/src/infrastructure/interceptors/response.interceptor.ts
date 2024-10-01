import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ResponseStatusTextEnum } from '../common/enum.ts/responseStatus.enum';

class Status {
  code: number;
  text: ResponseStatusTextEnum;
}

export class ResponseFormat<T> {
  statusCode: Status;
  message: string;
  data?: T;
  errorData?: T;
}

export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map((res) => ({
        data: res.data,
        cache: res.cache,
        statusCode: {
          code: 1,
          text: ResponseStatusTextEnum.SUCCESS,
        },
        message: res.message,
      })),
    );
  }
}
