import { Injectable } from '@nestjs/common';
import { GenericCrudService } from '../common/services/generic.crud.service';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user-response.dto';

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

  async getAll(): Promise<UserResponseDto[]> {
    const users = await super.findAll({});

    return users.map((user) => {
      const { password, salt, ...userWithoutPassword } = user;
      return new UserResponseDto(userWithoutPassword);
    });
  }

  async getOne(id: number): Promise<UserResponseDto> {
    const user = await this.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    const { password, salt, ...userWithoutPassword } = user;
    return new UserResponseDto(userWithoutPassword);
  }
}
