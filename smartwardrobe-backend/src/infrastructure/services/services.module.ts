import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchProductsService } from './search/search-products.service';
import { UploadProfilePictureService } from './uploadProfilePicture/upload-profile-picture';
import { FaissService } from './faiss/faiss.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageClusterModel } from '../frameworks/data-services/model/image-clusters.model';
import { DataServicesModule } from './data-services/data-service.module';
import { UploadSearchPictureService } from './uploadProfilePicture/upload-search-picture';
import { CacheService } from './cache/cache.service';
import { FirebaseService } from './firebase/firebase.service';
import { WebSocketService } from './web-sockets/friend-requests/web-sockets.service';
import { WebSocketGatewayService } from './web-sockets/friend-requests/websocket.gateway.service';
import { UploadAudioService } from './uploadProfilePicture/upload-audio-chat';
import { EmailService } from './sendgrid/sendgrid.service';
import { ConfigModule } from '@nestjs/config';
import { EmailTemplateService } from './sendgrid/email-template.service';

@Module({
  imports: [
    HttpModule,
    DataServicesModule,
    TypeOrmModule.forFeature([ImageClusterModel]),
    ConfigModule,
  ],
  providers: [
    SearchProductsService,
    UploadProfilePictureService,
    FaissService,
    UploadSearchPictureService,
    CacheService,
    FirebaseService,
    WebSocketService,
    WebSocketGatewayService,
    UploadAudioService,
    EmailService,

    EmailTemplateService,
  ],
  exports: [
    SearchProductsService,
    UploadProfilePictureService,
    FaissService,
    UploadSearchPictureService,
    UploadAudioService,
    CacheService,
    FirebaseService,
    WebSocketService,
    WebSocketGatewayService,
    EmailService,
  ],
})
export class ServicesModule {}
