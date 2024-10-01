import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './infrastructure/interceptors/response.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(ControllersModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards();
  app.enableCors();
  app.use(helmet());
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Smart Wardrobe')
    .setDescription('This is Smart Wardrobe ms API description')
    .setVersion('1.0')
    .addTag('Smart Wardrobe MS')
    .setExternalDoc('Postman Collection', '../api-json')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
