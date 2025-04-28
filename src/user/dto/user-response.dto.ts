import { IsString, IsEmail } from 'class-validator';

export class UserResponseDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  id: number;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
