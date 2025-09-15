import { User } from 'src/user/entities/user.entity';
import { Route } from 'src/route/entities/route.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Depot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  address: string;

  @ManyToOne(() => User, (user) => user.depots)
  user: User;

  @OneToMany(() => Route, (route) => route.originDepot)
  originRoutes: Route[];

  // LA CORRECTION EST ICI : destinationRoutes -> destinationDepot
  @OneToMany(() => Route, (route) => route.destinationDepot)
  destinationRoutes: Route[];
}