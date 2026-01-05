import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    user_name: string;

    @IsEmail()
    @IsNotEmpty()
    user_mail: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    user_password: string;
}
