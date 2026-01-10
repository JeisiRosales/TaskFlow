import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users') // Prefijo de ruta: /users
@UseInterceptors(ClassSerializerInterceptor) // Interceptor para transformar la respuesta (ej. excluir password)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post() // POST /users - Crear usuario
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get() // GET /users - Listar todos
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // GET /users/:id - Obtener uno
  findOne(@Param('id') id: string) {
    // Convertimos id string a number (+id)
    return this.usersService.findOne(+id);
  }

  @Patch(':id') // PATCH /users/:id - Actualizar
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/:id - Eliminar
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
