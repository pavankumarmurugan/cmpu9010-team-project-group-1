export abstract class IGenericRepository<T> {
  abstract getAll(): Promise<T[]>;
  abstract get<U>(properties: U): Promise<T>;
  abstract getAllByProperties<U>(properties: U): Promise<T[]>;
  abstract getAllByIdsIn(properties: any, propertyName: string): Promise<T[]>;
  abstract create(item: T): Promise<T>;
  abstract update(id: any, item: T);
  abstract delete(id: any);
  abstract deleteByProperties(properties: any);
  abstract search<U>(props: U): Promise<T[]>;
  abstract filter(postalCode: string, rent: number): Promise<T[]>;
  abstract getAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: T[]; total: number }>;
  abstract getAllPaginatedWithWhere(
    page: number,
    limit: number,
    where: any,
  ): Promise<{ data: any; total: number }>;
  abstract pollForChanges(
    lastChecked: Date,
    propertyName: string,
  ): Promise<T[]>;
}
