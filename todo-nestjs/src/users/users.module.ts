import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importar TypeOrmModule
import { User } from './entities/user.entity'; // Importar tu Entidad User

@Module({
  imports: [
    // Módulo es responsable de la tabla 'users'
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
