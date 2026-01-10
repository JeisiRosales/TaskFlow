# Guía de Implementación Detallada - Todo App NestJS

Esta guía proporciona pasos técnicos específicos y detallados para implementar el MVP de la aplicación Todo siguiendo el [roadmap.md](./roadmap.md).

---

## Fase 1: Configuración Inicial y Base de Datos

### 1.1 Inicialización del Proyecto

#### Crear proyecto con NestJS CLI

```bash
# Instalar NestJS CLI globalmente (si no lo tienes)
npm install -g @nestjs/cli

# Crear el proyecto
nest new todo-nestjs

# Seleccionar npm como package manager
# Navegar al directorio
cd todo-nestjs
```

#### Configurar Variables de Entorno

```bash
# Crear archivo .env en la raíz del proyecto
touch .env
```

**Contenido del archivo `.env`:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=todo_db

# JWT Configuration
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRATION=1d

# App Configuration
PORT=3000
NODE_ENV=development
```

**Instalar dependencia para variables de entorno:**

```bash
npm install @nestjs/config
```

**Configurar en `app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
```

#### Configurar Control de Versiones

```bash
# Inicializar Git (si no se hizo automáticamente)
git init

# Crear .gitignore (debería existir ya)
# Asegurar que contenga:
# node_modules/
# .env
# dist/

# Primer commit
git add .
git commit -m "feat: initial project setup"
```

**Checkpoint**: Ejecutar `npm run start:dev` y verificar que el servidor inicie en `http://localhost:3000`.

---

### 1.2 Configuración de Base de Datos con TypeORM

#### Instalar Dependencias

```bash
# TypeORM + PostgreSQL driver
npm install @nestjs/typeorm typeorm pg

# Opcional: Para desarrollo con Docker
# Asegúrate de tener Docker instalado
```

#### Crear archivo `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: todo_postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: todo_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Levantar la Base de Datos

```bash
# Iniciar contenedor de PostgreSQL
docker-compose up -d

# Verificar que esté corriendo
docker ps
```

#### Configurar TypeORM en `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Solo en desarrollo
        logging: true,
      }),
    }),
  ],
})
export class AppModule {}
```

**Checkpoint**: Ejecutar `npm run start:dev` y verificar en los logs que la conexión a PostgreSQL sea exitosa.

---

## Fase 2: Módulo de Usuarios y Autenticación

### 2.1 Crear Módulo y Entidad User

#### Generar Módulo Users

```bash
nest generate module users
nest generate service users
nest generate controller users
```

#### Crear Entidad User

**Archivo: `src/users/entities/user.entity.ts`**

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ length: 100 })
  user_name: string;

  @Column({ unique: true, length: 255 })
  user_mail: string;

  @Column()
  @Exclude() // Excluir password en respuestas
  user_password: string;

  @CreateDateColumn()
  created_at: Date;
}
```

#### Registrar Entidad en `users.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportar para uso en AuthModule
})
export class UsersModule {}
```

**✅ Checkpoint**: Reiniciar el servidor y verificar que la tabla `users` se cree en la base de datos.

```bash
# Conectarse a la BD para verificar
docker exec -it todo_postgres psql -U postgres -d todo_db
# Ejecutar: \dt
# Deberías ver la tabla 'users'
```

---

### 2.2 Implementar Autenticación con JWT

#### Instalar Dependencias

```bash
npm install @nestjs/passport passport @nestjs/jwt passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

#### Generar Módulo Auth

```bash
nest generate module auth
nest generate service auth
nest generate controller auth
```

#### Crear DTOs

**Archivo: `src/auth/dto/register.dto.ts`**

```typescript
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
```

**Archivo: `src/auth/dto/login.dto.ts`**

```typescript
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  user_mail: string;

  @IsString()
  @IsNotEmpty()
  user_password: string;
}
```

#### Implementar `auth.service.ts`

```typescript
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const existingUser = await this.usersService.findByEmail(registerDto.user_mail);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.user_password, 10);

    // Crear usuario
    const user = await this.usersService.create({
      ...registerDto,
      user_password: hashedPassword,
    });

    return {
      message: 'Usuario registrado exitosamente',
      user_id: user.user_id,
      user_mail: user.user_mail,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.user_mail);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.user_password, user.user_password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.user_id, email: user.user_mail };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_mail: user.user_mail,
      },
    };
  }
}
```

#### Implementar `users.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { user_mail: email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { user_id: id } });
  }
}
```

#### Crear JWT Strategy

**Archivo: `src/auth/strategies/jwt.strategy.ts`**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub, email: payload.email };
  }
}
```

#### Crear Guard JWT

**Archivo: `src/auth/guards/jwt-auth.guard.ts`**

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

#### Configurar `auth.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

#### Implementar `auth.controller.ts`

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

#### Instalar class-validator

```bash
npm install class-validator class-transformer
```

#### Habilitar validaciones globales en `main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar validaciones
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(3000);
}
bootstrap();
```

#### Importar AuthModule en `app.module.ts`

```typescript
@Module({
  imports: [
    ConfigModule.forRoot({ /* ... */ }),
    TypeOrmModule.forRootAsync({ /* ... */ }),
    UsersModule,
    AuthModule, // Agregar aquí
  ],
})
export class AppModule {}
```

**✅ Checkpoint - Probar Autenticación:**

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Juan Pérez",
    "user_mail": "juan@example.com",
    "user_password": "password123"
  }'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "user_mail": "juan@example.com",
    "user_password": "password123"
  }'
# Guardar el access_token de la respuesta

# 3. Probar endpoint protegido (crear después de implementar)
curl -X GET http://localhost:3000/profile \
  -H "Authorization: Bearer {TU_TOKEN_AQUI}"
```

---

## Fase 3: Módulo de Categorías

### 3.1 Crear Módulo Categories

```bash
nest generate module categories
nest generate service categories
nest generate controller categories
```

### 3.2 Crear Entidad Category

**Archivo: `src/categories/entities/category.entity.ts`**

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  @Column({ length: 100 })
  category_name: string;

  @Column({ type: 'text', nullable: true })
  category_descrip: string;

  @Column({ length: 7, default: '#3B82F6' }) // Color hex default (azul)
  category_color: string;
}
```

### 3.3 Crear DTOs

**Archivo: `src/categories/dto/create-category.dto.ts`**

```typescript
import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @IsString()
  @IsOptional()
  category_descrip?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color debe ser formato HEX (#RRGGBB)' })
  category_color?: string;
}
```

**Archivo: `src/categories/dto/update-category.dto.ts`**

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
```

### 3.4 Implementar Service y Controller

**Archivo: `src/categories/categories.service.ts`**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { category_id: id },
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}
```

**Archivo: `src/categories/categories.controller.ts`**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard) // Proteger todas las rutas
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
```

**Archivo: `src/categories/categories.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
```

**✅ Checkpoint - Probar CRUD de Categorías:**

```bash
# Obtener token primero (login)

# Crear categoría
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "category_name": "Trabajo",
    "category_descrip": "Tareas relacionadas al trabajo",
    "category_color": "#FF5733"
  }'

# Listar categorías
curl -X GET http://localhost:3000/categories \
  -H "Authorization: Bearer {TOKEN}"
```

---

## Fase 4: Módulo de Tareas

### 4.1 Crear Módulo Tasks

```bash
nest generate module tasks
nest generate service tasks
nest generate controller tasks
```

### 4.2 Crear Entidad Task con Relaciones

**Archivo: `src/tasks/entities/task.entity.ts`**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  task_id: string;

  @Column({ length: 200 })
  task_name: string;

  @Column({ type: 'text', nullable: true })
  task_descrip: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'task_creator' })
  creator: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'task_assign_to' })
  assignedTo: User;

  @Column({ type: 'int', default: 0 })
  task_story_points: number;

  @Column({ type: 'timestamp', nullable: true })
  task_delivery_date: Date;

  @ManyToOne(() => Category, { eager: true, nullable: true })
  @JoinColumn({ name: 'task_category' })
  category: Category;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  task_status: TaskStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### 4.3 Crear DTOs

**Archivo: `src/tasks/dto/create-task.dto.ts`**

```typescript
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt, Min, IsDateString, IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  task_name: string;

  @IsString()
  @IsOptional()
  task_descrip?: string;

  @IsUUID()
  @IsOptional()
  assignedToId?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  task_story_points?: number;

  @IsDateString()
  @IsOptional()
  task_delivery_date?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  task_status?: TaskStatus;
}
```

**Archivo: `src/tasks/dto/update-task-status.dto.ts`**

```typescript
import { IsEnum } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  task_status: TaskStatus;
}
```

### 4.4 Crear Decorador para Usuario Actual

**Archivo: `src/auth/decorators/current-user.decorator.ts`**

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### 4.5 Implementar Service

**Archivo: `src/tasks/tasks.service.ts`**

```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
    const creator = await this.usersService.findById(creatorId);

    const task = this.tasksRepository.create({
      task_name: createTaskDto.task_name,
      task_descrip: createTaskDto.task_descrip,
      task_story_points: createTaskDto.task_story_points,
      task_delivery_date: createTaskDto.task_delivery_date
        ? new Date(createTaskDto.task_delivery_date)
        : null,
      task_status: createTaskDto.task_status,
      creator,
    });

    // Asignar usuario si se especifica
    if (createTaskDto.assignedToId) {
      const assignedUser = await this.usersService.findById(createTaskDto.assignedToId);
      if (assignedUser) {
        task.assignedTo = assignedUser;
      }
    }

    // Asignar categoría si se especifica
    if (createTaskDto.categoryId) {
      const category = await this.categoriesService.findOne(createTaskDto.categoryId);
      if (category) {
        task.category = category;
      }
    }

    return await this.tasksRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find({
      relations: ['creator', 'assignedTo', 'category'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { task_id: id },
      relations: ['creator', 'assignedTo', 'category'],
    });

    if (!task) {
      throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
    }

    return task;
  }

  async updateStatus(id: string, updateStatusDto: UpdateTaskStatusDto): Promise<Task> {
    const task = await this.findOne(id);
    task.task_status = updateStatusDto.task_status;
    return await this.tasksRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);
  }
}
```

### 4.6 Implementar Controller

**Archivo: `src/tasks/tasks.controller.ts`**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.userId);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateTaskStatusDto) {
    return this.tasksService.updateStatus(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
```

### 4.7 Configurar Module

**Archivo: `src/tasks/tasks.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
    CategoriesModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
```

**✅ Checkpoint - Probar Tareas:**

```bash
# Crear tarea
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "task_name": "Desarrollar API de usuarios",
    "task_descrip": "Implementar CRUD completo",
    "task_story_points": 5,
    "assignedToId": "{USER_ID}",
    "categoryId": "{CATEGORY_ID}"
  }'

# Cambiar estado
curl -X PATCH http://localhost:3000/tasks/{TASK_ID}/status \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"task_status": "in_progress"}'
```

---

## Fase 5: Módulo de Comentarios

### 5.1 Crear Módulo Comments

```bash
nest generate module comments
nest generate service comments
nest generate controller comments
```

### 5.2 Crear Entidad Comment

**Archivo: `src/comments/entities/comment.entity.ts`**

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  comment_id: string;

  @Column({ type: 'text' })
  comment_content: string;

  @ManyToOne(() => Task, { eager: false })
  @JoinColumn({ name: 'comment_from_task' })
  task: Task;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'comment_creator' })
  creator: User;

  @CreateDateColumn()
  comment_date: Date;
}
```

### 5.3 Crear DTOs

**Archivo: `src/comments/dto/create-comment.dto.ts`**

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  comment_content: string;
}
```

### 5.4 Implementar Service

**Archivo: `src/comments/comments.service.ts`**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private tasksService: TasksService,
    private usersService: UsersService,
  ) {}

  async create(taskId: string, createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const task = await this.tasksService.findOne(taskId);
    const user = await this.usersService.findById(userId);

    const comment = this.commentsRepository.create({
      comment_content: createCommentDto.comment_content,
      task,
      creator: user,
    });

    return await this.commentsRepository.save(comment);
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    return await this.commentsRepository.find({
      where: { task: { task_id: taskId } },
      relations: ['creator'],
      order: { comment_date: 'ASC' },
    });
  }
}
```

### 5.5 Implementar Controller Anidado

**Archivo: `src/comments/comments.controller.ts`**

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.create(taskId, createCommentDto, user.userId);
  }

  @Get()
  findByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }
}
```

### 5.6 Configurar Module

**Archivo: `src/comments/comments.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { TasksModule } from '../tasks/tasks.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    TasksModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
```

**✅ Checkpoint - Probar Comentarios:**

```bash
# Agregar comentario a una tarea
curl -X POST http://localhost:3000/tasks/{TASK_ID}/comments \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "comment_content": "Esta tarea necesita revisión antes de continuar"
  }'

# Ver comentarios de una tarea
curl -X GET http://localhost:3000/tasks/{TASK_ID}/comments \
  -H "Authorization: Bearer {TOKEN}"
```

---

## Fase 6: Documentación y Refinamiento

### 6.1 Configurar Swagger/OpenAPI

#### Instalar Dependencias

```bash
npm install @nestjs/swagger
```

#### Configurar en `main.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Todo App API')
    .setDescription('API RESTful para gestión de tareas con NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y registro')
    .addTag('users', 'Gestión de usuarios')
    .addTag('categories', 'Gestión de categorías')
    .addTag('tasks', 'Gestión de tareas')
    .addTag('comments', 'Comentarios en tareas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Aplicación corriendo en: http://localhost:3000`);
  console.log(`📚 Documentación Swagger: http://localhost:3000/api/docs`);
}
bootstrap();
```

#### Decorar Controladores con Swagger

**Ejemplo en `auth.controller.ts`:**

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna token JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

**Decorar DTOs con ApiProperty:**

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsString()
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email único del usuario' })
  @IsEmail()
  user_mail: string;

  @ApiProperty({ example: 'password123', minimum: 6, description: 'Contraseña del usuario' })
  @IsString()
  @MinLength(6)
  user_password: string;
}
```

**✅ Checkpoint**: Visitar `http://localhost:3000/api/docs` y verificar que todos los endpoints estén documentados.

---

### 6.2 Validaciones Avanzadas y Manejo de Errores

#### Filtro Global de Excepciones

**Archivo: `src/common/filters/http-exception.filter.ts`**

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: typeof message === 'string' ? message : (message as any).message,
    });
  }
}
```

**Aplicar en `main.ts`:**

```typescript
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AllExceptionsFilter());
  // ...
}
```

#### Validar Eliminación de Categorías con Tareas

**Actualizar `categories.service.ts`:**

```typescript
import { BadRequestException } from '@nestjs/common';

async remove(id: string): Promise<void> {
  const category = await this.categoriesRepository.findOne({
    where: { category_id: id },
    relations: ['tasks'], // Asumiendo relación OneToMany
  });

  if (!category) {
    throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
  }

  // Verificar si tiene tareas asociadas
  if (category.tasks && category.tasks.length > 0) {
    throw new BadRequestException(
      'No se puede eliminar la categoría porque tiene tareas asociadas'
    );
  }

  await this.categoriesRepository.remove(category);
}
```

**Agregar relación en `category.entity.ts`:**

```typescript
@OneToMany(() => Task, (task) => task.category)
tasks: Task[];
```

**✅ Checkpoint Final**: 

```bash
# Probar validación de email inválido
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "Test",
    "user_mail": "invalid-email",
    "user_password": "123456"
  }'
# Debería devolver 400 Bad Request

# Probar eliminación de categoría con tareas
# 1. Crear categoría
# 2. Crear tarea con esa categoría
# 3. Intentar eliminar la categoría
# Debería devolver error de validación
```

---

## Resumen de Comandos Útiles

```bash
# Desarrollo
npm run start:dev

# Build de producción
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov

# Base de datos
docker-compose up -d     # Iniciar BD
docker-compose down      # Detener BD
docker-compose logs -f   # Ver logs

# Generar recursos
nest generate module <nombre>
nest generate controller <nombre>
nest generate service <nombre>
```

---

## Próximos Pasos Recomendados

1. **Testing**: Implementar tests unitarios y e2e
2. **Migrations**: Cambiar de `synchronize: true` a migraciones con TypeORM
3. **Paginación**: Agregar paginación a endpoints de listado
4. **Filtros avanzados**: Implementar filtros por estado, categoría, usuario asignado
5. **Logger**: Implementar sistema de logs con Winston o Pino
6. **Rate Limiting**: Proteger endpoints contra abuso
7. **CORS**: Configurar CORS para frontend
8. **Deploy**: Preparar para despliegue en producción (Docker, Kubernetes, etc.)
