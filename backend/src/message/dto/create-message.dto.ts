// backend/src/message/dto/create-message.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";
import { MessageType } from "../entities/message.entity";

export class CreateMessageDto {
    @IsUUID()
    @IsNotEmpty()
    conversationId: string;

    @IsUUID()
    @IsNotEmpty()
    senderId: string;

    @IsEnum(MessageType)
    @IsNotEmpty()
    message_type: MessageType;

    @IsString()
    @IsOptional()
    text_content?: string;

    @IsUrl()
    @IsOptional()
    file_url?: string;
}
