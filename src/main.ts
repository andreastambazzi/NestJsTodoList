import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/AppModule';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './services/AppConfig';

const appConfig:  AppConfig = AppConfig.getInstance();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ToDo Api Doc')
    .setDescription('Api di gestione dell\'applicazione ToDo')
    .setVersion('1.0')
    .addTag('')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, documentFactory);

  await app.listen(appConfig.getNodePort());
}
bootstrap();
