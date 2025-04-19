import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic.crud.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends GenericCrudService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async createWithRole(user: any): Promise<any> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
