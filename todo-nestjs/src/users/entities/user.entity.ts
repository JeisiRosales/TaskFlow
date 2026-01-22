import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' }) // Nombre de la tabla en Postgres
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'user_name' })
  user_name: string;

  @Column({ name: 'user_mail', unique: true })
  user_mail: string;

  @Column({ name: 'user_password' })
  @Exclude()
  user_password: string;
}
