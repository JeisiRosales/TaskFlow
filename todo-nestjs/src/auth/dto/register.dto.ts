import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    // @IsString: Valida que el valor sea una cadena de texto
    // @IsNotEmpty: Valida que el campo no esté vacío (null ni string vacío)
    // @MinLength(3): Valida que tenga al menos 3 caracteres
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    user_name: string;

    // @IsEmail: Valida que el formato del string sea un email válido
    @IsEmail()
    @IsNotEmpty()
    user_mail: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6) // Contraseña debe tener al menos 6 caracteres
    user_password: string;
}
