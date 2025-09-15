// backend/src/message/entities/message.entity.ts

import { Conversation } from "src/conversation/entities/conversation.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// On définit les types de message possibles
export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
}

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: MessageType,
        default: MessageType.TEXT,
    })
    message_type: MessageType;

    @Column({ type: 'text', nullable: true }) // Le contenu textuel du message
    text_content: string;

    @Column({ nullable: true }) // L'URL si c'est une image
    file_url: string;
    
    // Le message est lié à une conversation
    @ManyToOne(() => Conversation, (conversation) => conversation.messages)
    conversation: Conversation;

    // Le message a un expéditeur
    @ManyToOne(() => User)
    sender: User;

    @CreateDateColumn()
    created_at: Date;
}