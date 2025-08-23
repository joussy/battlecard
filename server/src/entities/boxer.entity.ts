import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Gender } from '@/interfaces/modality.interface';

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

  @Column({ type: 'int', nullable: false, default: 0 })
  nbFights: number;

  @Column()
  club: string;

  @Column({ type: 'float', nullable: true })
  weight?: number;

  @Column({ nullable: false })
  gender: Gender;

  @Column()
  license: string;

  @Column()
  userId: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'now()',
  })
  created: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'now()',
  })
  updated: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}
