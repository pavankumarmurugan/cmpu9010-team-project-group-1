import { ApiProperty } from '@nestjs/swagger';

export class ProfilePictureUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
