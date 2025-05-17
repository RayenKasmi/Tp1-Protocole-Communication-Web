import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { CvHistoryEvent } from '../constants/cv-history.constants';
import { Cv } from '../../cv/entities/cv.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class CvHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cv, (cv) => cv.histories, { onDelete: 'CASCADE' })
  cv: Cv;

  @Column({ type: 'enum', enum: CvHistoryEvent })
  eventType: CvHistoryEvent;

  @ManyToOne(() => User, { eager: true })
  performedBy: User;

  @CreateDateColumn()
  performedAt: Date;

  @Column({ type: 'json' })
  snapshot: Record<string, any>;
}
