import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsIn(['google', 'facebook'])
  @IsNotEmpty()
  provider: string;
}
