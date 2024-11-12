import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IResponse } from 'src/core/interface/response.interface';
import { MESSAGES } from 'src/infrastructure/common/enum.ts/messages';

@Injectable()
export class ConfigUsecase {
  constructor(private configService: ConfigService) {}

  // async get(): Promise<IResponse<any>> {
  //   return {
  //     data: {
  //       apiKey: this.configService.get('FIREBASE_API_KEY'),
  //       authDomain: this.configService.get('FIREBASE_AUTH_DOMAIN'),
  //       databaseURL: this.configService.get('FIREBASE_DATABASE_URL'),
  //       projectId: this.configService.get('FIREBASE_PROJECT_ID'),
  //       storageBucket: this.configService.get('FIREBASE_STORAGE_BUCKET'),
  //       messagingSenderId: this.configService.get(
  //         'FIREBASE_MESSAGING_SENDER_ID',
  //       ),
  //       appId: this.configService.get('FIREBASE_APP_ID'),
  //       measurementId: this.configService.get('FIREBASE_MEASUREMENT_ID'),
  //       vapidKey: this.configService.get('FIREBASE_VAPID_KEY'),
  //     },
  //     message: MESSAGES.CONFIG.SUCCESS,
  //   };
  // }
}
