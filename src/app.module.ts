import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    // ConfigModule: Carga variables de entorno desde el archivo .env
    // isGlobal: true hace que no necesitemos importar ConfigModule en otros módulos.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // TypeOrmModule: Configuración de la conexión a Base de Datos (PostgreSQL)
    // Se usa forRootAsync para poder inyectar ConfigService y leer las variables de entorno.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        // Auto-carga entidades que sigan el patrón *.entity.ts
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // synchronize: true -> Crea/Actualiza tablas automáticamente (SOLO DESARROLLO)
        synchronize: true,
        logging: true,
      }),
    }),

    // Módulos de funcionalidad (Feature Modules)
    UsersModule,
    AuthModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
