import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    // Inyección del repositorio de TypeORM para interactuar con la tabla 'users'.
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  // Crear nuevo usuario en la BD.
  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  // Obtener todos los usuarios.
  findAll() {
    return this.usersRepository.find();
  }

  // Obtener usuario por ID.
  findOne(id: number) {
    return this.usersRepository.findOne({ where: { user_id: id } });
  }

  // Método auxiliar para buscar por email (usado en Auth).
  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { user_mail: email } });
  }

  // Actualizar usuario existente.
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  // Eliminar usuario.
  async remove(id: number) {
    const user = await this.findOne(id);
    if (user) {
      return await this.usersRepository.remove(user);
    }
  }
}
