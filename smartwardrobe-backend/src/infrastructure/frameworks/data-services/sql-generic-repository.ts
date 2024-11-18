import { IGenericRepository } from 'src/core/abstracts';
import { Between, FindOptionsWhere, Like, MoreThan, Repository } from 'typeorm';
import { In } from 'typeorm';

export class SQLGenericRepository<T> implements IGenericRepository<T> {
  private _repository: Repository<T>;
  private _populateOnFind: any[];

  constructor(repository: Repository<T>, populateOnFind: any[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  async getAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: any; total: number }> {
    const options: any = {
      take: limit,
    };
    if (page > 1) {
      options.skip = (page - 1) * limit;
    }
    const [data, total] = await this._repository.findAndCount(options);
    return { data, total };
  }

  async getAllPaginatedWithWhere(
    page: number,
    limit: number,
    where: any = {},
  ): Promise<{ data: any; total: number }> {
    const options: any = {
      take: limit,
      where,
    };
    if (page > 1) {
      options.skip = (page - 1) * limit;
    }
    const [data, total] = await this._repository.findAndCount(options);
    return { data, total };
  }

  create(item: T): Promise<T> {
    return this._repository.save(item);
  }

  getAll(): Promise<T[]> {
    return this._repository.find({
      select: this._populateOnFind,
    });
  }

  get(properties: any): Promise<T> {
    return this._repository.findOne({
      select: this._populateOnFind,
      where: { ...properties },
    });
  }

  update(id: number, item: any) {
    return this._repository.update(id, item);
  }

  getAllByProperties(properties: any): Promise<T[]> {
    return this._repository.find({
      select: this._populateOnFind,
      where: { ...properties },
    });
  }

  async getAllByPropertiesV2(
    properties: any,
    relations: string[] = [],
  ): Promise<T[]> {
    const options: any = {
      where: { ...properties },
    };

    if (relations.length > 0) {
      options.relations = relations;
    }

    return await this._repository.find(options);
  }

  delete(id: any) {
    return this._repository.delete(id);
  }

  async deleteByProperties(properties: any) {
    return await this._repository.delete({ ...properties });
  }

  async getAllByIdsIn(properties: any, propertyName: string): Promise<T[]> {
    const query: any = {
      [propertyName]: In(properties),
    };
    return await this._repository.findBy(query);
  }

  search(searchCriteria: any): Promise<T[]> {
    return this._repository.find({
      where: [
        { username: Like(`%${searchCriteria}%`) },
        { firstname: Like(`%${searchCriteria}%`) },
        { lastname: Like(`%${searchCriteria}%`) },
        { email: Like(`%${searchCriteria}%`) },
      ] as any,
    });
  }

  filter(postalCode: string, price = 1000): Promise<T[]> {
    return this._repository.find({
      where: [
        {
          postalCode,
          price: Between(0, price),
        },
      ] as any,
    });
  }

  async pollForChanges(lastChecked: Date, propertyName: string): Promise<T[]> {
    const query = {
      [propertyName]: MoreThan(lastChecked),
    } as unknown as FindOptionsWhere<T>;

    return this._repository.find({
      where: query,
    });
  }

  async getAllWithOrConditions(
    orConditions: { [key: string]: any }[],
    relations: string[] = [],
  ): Promise<T[]> {
    const queryBuilder = this._repository.createQueryBuilder('entity');

    if (relations.length > 0) {
      relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    }

    orConditions.forEach((condition, index) => {
      const whereClause = Object.keys(condition)
        .map((key) => `entity.${key} = :${key}_${index}`)
        .join(' AND ');

      if (index === 0) {
        queryBuilder.where(
          whereClause,
          this.formatParameters(condition, index),
        );
      } else {
        queryBuilder.orWhere(
          whereClause,
          this.formatParameters(condition, index),
        );
      }
    });

    return await queryBuilder.getMany();
  }

  // Helper method to format parameters
  private formatParameters(properties: any, index: number) {
    const formattedParams: Record<string, any> = {};
    Object.keys(properties).forEach((key) => {
      formattedParams[`${key}_${index}`] = properties[key];
    });
    return formattedParams;
  }
}
