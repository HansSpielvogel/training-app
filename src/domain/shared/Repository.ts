export interface Repository<T> {
  findById(id: string): Promise<T | undefined>
  findAll(): Promise<T[]>
  save(entity: T): Promise<void>
  delete(id: string): Promise<void>
}
