// backend/src/tracking/entities/tracking.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Commande } from '../../commande/entities/commande.entity';

// ON DÉCLARE ET EXPORTE L'ENUM ICI
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELED = 'canceled',
}

@Entity()
export class Tracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @ManyToOne(() => Commande, (commande) => commande.trackingHistory)
  commande: Commande;

  @CreateDateColumn()
  created_at: Date;
}