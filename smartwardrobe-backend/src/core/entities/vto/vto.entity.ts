import { BaseEntity } from '../base/base.entity';

export class VtoImageSearchEntity extends BaseEntity {
  readonly id?: number;
  readonly modelImageName?: string;
  readonly imageName?: string;
  readonly vtoS3Url?: string;
}
