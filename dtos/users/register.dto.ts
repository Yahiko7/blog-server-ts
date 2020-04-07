import { IsNotEmpty, IsEmail, IsOptional, IsString} from 'class-validator'

export default class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
  
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  introduce: string;
}
