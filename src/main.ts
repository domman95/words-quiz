import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3000);
  console.log(`🚀 Words Quiz application is running on http://localhost:3000/graphql`);
}
bootstrap();
