import { IGenericRepository } from 'src/core/abstracts';
import { Between, Like, Repository } from 'typeorm';
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
        {
          title: Like(`%${searchCriteria}%`),
        },
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
}
