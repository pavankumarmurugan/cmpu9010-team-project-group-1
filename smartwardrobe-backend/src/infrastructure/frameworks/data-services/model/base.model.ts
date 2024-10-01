import { Column } from 'typeorm';

export class BaseModel {
  @Column({ type: 'date', name: 'updated_at' })
  readonly updatedAt?: Date;
  @Column({ type: 'date', name: 'created_at' })
  readonly createdAt?: Date;
}
