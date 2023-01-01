import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
// import { MicroserviceOptions } from '@nestjs/microservices';
import { LoggerInterceptor } from '@polyorg/nest';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: new NestLoggerAdapter(),
    cors: true,
  });

  // app.connectMicroservice<MicroserviceOptions>({})

  await app.startAllMicroservices();

  if (process.env.ENABLE_SHUTDOWN_HOOKS) {
    // Remove listeners created by Prisma
    process.removeAllListeners('SIGTERM');
    process.removeAllListeners('SIGINT');
    app.enableShutdownHooks();
  }

  // Global interceptors
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggerInterceptor('poly-core'),
  );

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      skipMissingProperties: true,
      transform: true,
    }),
  );

  await app.listen(process.env.SERVICE_PORT || 5001);
}
bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
