import { AppModule } from './app.module';
import { HTTP_PORT } from './environment';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(HTTP_PORT);
}
bootstrap();
