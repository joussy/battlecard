import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tournament } from './tournament.entity';
import { Boxer } from './boxer.entity';

@Entity()
export class TournamentBoxer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tournament, { eager: false })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column()
  tournamentId: string;

  @ManyToOne(() => Boxer, { eager: false })
  @JoinColumn({ name: 'boxerId' })
  boxer: Boxer;

  @Column()
  boxerId: string;
}
