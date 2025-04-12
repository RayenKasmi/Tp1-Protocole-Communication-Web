import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cv } from '../../cv/entities/cv.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({ unique: true, length: 20 })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
    
    @OneToMany(() => Cv, (cv) => cv.user)
    cvs: Cv[];
}
