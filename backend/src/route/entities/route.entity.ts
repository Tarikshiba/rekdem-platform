import { Depot } from 'src/depot/entities/depot.entity';
import { User } from 'src/user/entities/user.entity';
import { Commande } from 'src/commande/entities/commande.entity'; // Ligne à ajouter
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

export enum TransportMode {
  AIR = 'air',
  SEA = 'sea',
  EXPRESS = 'express',
}

@Entity()
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Depot, (depot) => depot.originRoutes)
  originDepot: Depot;

  @ManyToOne(() => Depot, (depot) => depot.destinationRoutes)
  destinationDepot: Depot;

  @Column({
    type: 'enum',
    enum: TransportMode,
  })
  mode: TransportMode;

  @Column()
  price_per_kg: number;

  @Column()
  estimated_duration_in_days: number;

  @ManyToOne(() => User, (user) => user.routes)
  user: User;

  // PROPRIÉTÉ À AJOUTER
  @OneToMany(() => Commande, (commande) => commande.route)
  commandes: Commande[];
}