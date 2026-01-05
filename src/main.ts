import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

//Función de arranque de la aplicación.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
