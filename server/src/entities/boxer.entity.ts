import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Boxer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column({ type: 'int', nullable: false })
  nbFights: number;

  @Column()
  club: string;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ nullable: true })
  gender?: 'male' | 'female';

  @Column()
  license: string;

  @Column()
  userId: string;

  @Column({ type: 'timestamp', nullable: true })
  created?: string;

  @Column({ type: 'timestamp', nullable: true })
  updated?: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
