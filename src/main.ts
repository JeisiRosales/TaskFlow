import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Función de arranque de la aplicación.
 * Crea una instancia de NestJS usando AppModule y configura pipes globales.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar ValidationPipe de forma global.
  // Esto asegura que todos los endpoints validen los DTOs entrantes 
  // usando reglas de class-validator (ej. @IsString(), @IsEmail()).
  // - whitelist: true -> Elimina propiedades no definidas en el DTO.
  // - forbidNonWhitelisted: true -> Lanza error si se envían propiedades extra.
  // - transform: true -> Transforma automáticamente los payloads a instancias de los DTOs.
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Iniciar el servidor en el puerto 3000
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
