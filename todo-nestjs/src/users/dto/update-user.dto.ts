import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType: Toma todos los campos de CreateUserDto y los hace opcionales.
// Esto es ideal para actualizaciones donde solo enviamos los campos que cambiaron.
// Si CreateUserDto tuviera validadores, también se aplicarían aquí (como opcionales).
export class UpdateUserDto extends PartialType(CreateUserDto) { }
