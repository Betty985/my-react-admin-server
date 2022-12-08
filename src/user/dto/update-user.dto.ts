import { IsNotEmpty, IsEmail } from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty()
  readonly bio: string;
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly image: string;
}
