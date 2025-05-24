import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Boxer } from './boxer.entity';
import { Tournament } from './tournament.entity';

@Entity()
export class Fight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  order: number;

  @ManyToOne(() => Boxer, { eager: false })
  @JoinColumn({ name: 'boxer1Id' })
  boxer1: Boxer;

  @Column()
  boxer1Id: string;

  @ManyToOne(() => Boxer, { eager: false })
  @JoinColumn({ name: 'boxer2Id' })
  boxer2: Boxer;

  @Column()
  boxer2Id: string;

  @ManyToOne(() => Tournament, { eager: false })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column()
  tournamentId: string;
}
