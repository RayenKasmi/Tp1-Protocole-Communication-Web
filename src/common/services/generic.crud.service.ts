import { NotFoundException } from '@nestjs/common/exceptions';
import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

// A generic base service class that provides basic CRUD operations

export abstract class GenericCrudService<T extends ObjectLiteral> {
  constructor(private readonly repo: Repository<T>) {}

  findAll({
    paginationQuery,
    where,
  }: {
    paginationQuery?: PaginationQueryDto;
    where?: any[];
  }): Promise<T[]> {
    const { limit, offset } = paginationQuery ?? {};
    return this.repo.find({
      skip: offset,
      take: limit,
      where,
    });
  }

  async findOne(id: any): Promise<T> {
    const result = await this.repo.findOne({ where: { id } as any });

    if (!result) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return result;
  }

  async update(id: any, data: DeepPartial<T>): Promise<T> {
    try {
      const entity = await this.repo.preload({
        //creates an entity instance with the existing values and the updates
        id,
        ...data,
      });

      if (!entity) {
        throw new NotFoundException(
          `Update failed: Entity with ID ${id} not found`,
        );
      }

      return await this.repo.save(entity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Update failed: ${error.message}`);
    }
  }

  async remove(id: any): Promise<void> {
    try {
      const result = await this.repo.delete(id); //could use softDelete instead or later on

      if (result.affected === 0) {
        //entity not found
        throw new NotFoundException(`Entity with ID ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
