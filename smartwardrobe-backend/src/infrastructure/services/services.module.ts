import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchService } from './search/search';
import { UploadProfilePictureService } from './uploadProfilePicture/upload-profile-picture';

@Module({
  imports: [HttpModule],
  providers: [SearchService, UploadProfilePictureService],
  exports: [SearchService, UploadProfilePictureService],
})
export class ServicesModule {}
