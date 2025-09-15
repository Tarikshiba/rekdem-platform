// backend/src/conversation/entities/conversation.entity.ts

import { Commande } from "src/commande/entities/commande.entity";
import { Message } from "src/message/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Une conversation est liée à une seule commande
    @OneToOne(() => Commande, (commande) => commande.conversation)
    @JoinColumn() // Cette ligne est importante pour la relation OneToOne
    commande: Commande;

    // Le client participant à la conversation
    @ManyToOne(() => User)
    client: User;

    // Le transitaire participant à la conversation
    @ManyToOne(() => User)
    transitaire: User;

    // Une conversation peut contenir plusieurs messages
    @OneToMany(() => Message, (message) => message.conversation)
    messages: Message[];
}