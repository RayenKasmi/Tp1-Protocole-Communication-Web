import { Injectable } from '@nestjs/common';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GenericRepository } from 'src/shared/repositories/generic.repository';
import { Cv } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CvService extends GenericRepository<Cv>{
  constructor(@InjectRepository(Cv) private readonly cvRepository: Repository<Cv>) {
    super(cvRepository);
  }

}
