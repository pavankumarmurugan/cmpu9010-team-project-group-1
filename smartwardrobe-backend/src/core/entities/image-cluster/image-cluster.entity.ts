import { BaseEntity } from '../base/base.entity';

export class ImageClusterEntity extends BaseEntity {
  readonly imageId?: number;
  readonly imageName?: string;
  readonly clusterId?: number;
  readonly clipEmbedding?: number[];
}
