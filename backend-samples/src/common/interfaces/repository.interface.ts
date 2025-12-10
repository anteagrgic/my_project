export interface IRepository<C, R> {
  create(data: C): Promise<R>;

  update(id: string, data: Partial<C>): Promise<R | null>;

  delete(id: string): Promise<boolean>;
}

