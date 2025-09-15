// backend/src/user/entities/user.entity.ts

import { Depot } from 'src/depot/entities/depot.entity';
import { Route } from 'src/route/entities/route.entity';
import { Commande } from 'src/commande/entities/commande.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';
import { UserRole, SubscriptionPlan, SubscriptionStatus } from 'src/types/enums';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  company_name: string;
  
  @Column({ type: 'text', nullable: true })
  profile_bio: string;

  @Column({ nullable: true })
  profile_picture_url: string;

  @Column({ nullable: true })
  cover_picture_url: string;

  @Column({ nullable: true })
  whatsapp_number: string;
  
  @Column({ nullable: true })
  facebook_url: string;

  @Column({ nullable: true })
  instagram_url: string;

  @Column({ nullable: true })
  youtube_url: string;

  @Column({ nullable: true })
  tiktok_url: string;

  @Column({ nullable: true })
  telegram_url: string;

  @Column({ type: 'enum', enum: SubscriptionPlan, nullable: true })
  subscription_plan: SubscriptionPlan;

  @Column({ type: 'enum', enum: SubscriptionStatus, nullable: true, default: SubscriptionStatus.INACTIVE })
  subscription_status: SubscriptionStatus;

  @OneToMany(() => Depot, (depot) => depot.user)
  depots: Depot[];

  @OneToMany(() => Route, (route) => route.user)
  routes: Route[];

  @OneToMany(() => Commande, (commande) => commande.client)
  commandes: Commande[];

  @OneToMany(() => Message, (message) => message.sender)
  sent_messages: Message[];

  @OneToMany(() => Conversation, (conversation) => conversation.client)
  client_conversations: Conversation[];

  @OneToMany(() => Conversation, (conversation) => conversation.transitaire)
  transitaire_conversations: Conversation[];
}