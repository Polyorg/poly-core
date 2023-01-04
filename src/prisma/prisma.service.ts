import {
  INestApplication,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PolyLogger, POLY_LOGGER_PROVIDER } from '@polyorg/nest';
import { PrismaClient } from '@prisma/client';

@Injectable({})
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(POLY_LOGGER_PROVIDER)
    private logger: PolyLogger,
  ) {
    super();
    this.logger = this.logger.child({ class: PrismaService.name });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      this.logger.error('Prisma connection error', error);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
