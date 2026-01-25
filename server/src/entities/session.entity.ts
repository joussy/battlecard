// src/session/session.entity.ts
import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { ISession } from 'connect-typeorm';

@Entity()
export class Session implements ISession {
  @Index()
  @Column('bigint')
  expiredAt = Date.now();

  @PrimaryColumn('varchar', { length: 255 })
  id: string;

  @Column('text')
  json: string;

  @DeleteDateColumn()
  destroyedAt?: Date;
}
