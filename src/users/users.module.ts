import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  // TypeOrmModule.forFeature([User]): Registra la entidad User en este módulo.
  // Esto permite inyectar el Repository<User> en UsersService.
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  // Exportar UsersService permite que otros módulos (como AuthModule)
  // lo importen y usen sus métodos (ej. buscar usuario por email).
  exports: [UsersService],
})
export class UsersModule { }
