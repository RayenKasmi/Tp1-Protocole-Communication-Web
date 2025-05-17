import { IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  receiverUsername: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
