import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
// import { GraphQLModule } from '@nestjs/graphql';
import { PolyLoggerModule } from '@polyorg/nest';

@Module({
  imports: [
    // GraphQLModule.forRoot({})
    PolyLoggerModule.register('poly-core'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
