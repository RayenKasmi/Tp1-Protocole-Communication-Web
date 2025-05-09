import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvHistory } from './entities/cv-history.entity';
import { CvListener } from './cv.listener';
import { Cv } from 'src/cv/entities/cv.entity';
import { CvHistoryService } from './services/cv-history.service';

@Module({
    imports: [TypeOrmModule.forFeature([CvHistory])],
    providers: [CvListener, CvHistoryService],

})
export class CvHistoryModule {}
