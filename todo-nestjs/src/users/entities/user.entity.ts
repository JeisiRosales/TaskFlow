import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Exclude as ExcludeDecorator } from 'class-transformer';

// @Entity: Marca esta clase como una entidad de base de datos.
// 'users' es el nombre de la tabla en PostgreSQL.
@Entity({ name: 'users' })
export class User {
  // @PrimaryGeneratedColumn: Columna llave primaria auto-incrementable.
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'user_name' })
  user_name: string;

  // unique: true evita correos duplicados a nivel de base de datos.
  @Column({ name: 'user_mail', unique: true })
  user_mail: string;

  // @ExcludeDecorator: Evita que el password se envíe en la respuesta JSON al cliente.
  // Es crucial para la seguridad (usamos class-transformer para esto).
  @Column({ name: 'user_password' })
  @ExcludeDecorator()
  user_password: string;
}
