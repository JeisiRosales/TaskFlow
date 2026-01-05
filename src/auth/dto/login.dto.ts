import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    // Validamos que sea un email y no esté vacío
    @IsEmail()
    @IsNotEmpty()
    user_mail: string;

    // Validamos que sea un string y no esté vacío
    @IsString()
    @IsNotEmpty()
    user_password: string;
}