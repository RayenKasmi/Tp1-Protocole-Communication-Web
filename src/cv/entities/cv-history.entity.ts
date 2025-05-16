import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class CvHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: CvAction;

  @Column()
  cvId: number;

  @Column()
  userId: number;

  @CreateDateColumn()
  timestamp: Date;
}

export enum CvAction {
    CREATED = 'created',
    UPDATED = 'updated',
    DELETED = 'deleted',
}
