// backend/src/commande/entities/commande.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
  OneToOne, // On importe OneToOne
} from 'typeorm';
import { Route } from '../../route/entities/route.entity';
import { User } from '../../user/entities/user.entity';
import { Tracking } from '../../tracking/entities/tracking.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity'; // On importe Conversation

@Entity()
export class Commande {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.commandes)
  client: User;

  @ManyToOne(() => Route, (route) => route.commandes)
  route: Route;

  // --- NOUVEAUX CHAMPS POUR LES DÉTAILS DU COLIS ---
  @Column({ nullable: true })
  external_tracking_number: string;

  @Column({ nullable: true })
  purchase_site: string;

  @Column({ type: 'text', nullable: true })
  product_description: string;

  @Column({ type: 'float', nullable: true })
  declared_value: number;

  @OneToMany(() => Tracking, (tracking) => tracking.commande)
  trackingHistory: Tracking[];

  // --- NOUVELLE RELATION ---
  // Une commande a une seule conversation
  @OneToOne(() => Conversation, (conversation) => conversation.commande)
  conversation: Conversation;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}