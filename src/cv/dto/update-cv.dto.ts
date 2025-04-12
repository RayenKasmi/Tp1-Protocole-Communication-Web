import { OmitType } from '@nestjs/mapped-types';
import { CreateCvDto } from './create-cv.dto';

export class UpdateCvDto extends OmitType(CreateCvDto, ['user']) {}
