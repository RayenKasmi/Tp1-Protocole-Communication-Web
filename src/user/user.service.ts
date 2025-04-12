import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenericRepository } from 'src/shared/repositories/generic.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends GenericRepository<User> {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super(userRepository);
  }
}
