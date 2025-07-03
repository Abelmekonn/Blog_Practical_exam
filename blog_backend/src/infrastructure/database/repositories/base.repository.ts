import { Repository, DeepPartial } from 'typeorm';
import { IBaseRepository } from '../../../core/base/base.repository.interface';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(
    private readonly repository: Repository<T extends object ? T : never>,
  ) {}

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(
      data as DeepPartial<T extends object ? T : never>,
    );
    return this.repository.save(entity as any);
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    const updatedEntity = await this.findById(id);
    if (!updatedEntity) {
      throw new Error(`Entity with id ${id} not found after update`);
    }
    return updatedEntity;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
