import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PolyLoggerModule } from '@polyorg/nest';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { Request } from 'express';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { join } from 'path';
import { OrganizationModule } from './core/organization/organization.module';
import { TeamsModule } from './core/teams/teams.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      installSubscriptionHandlers: true,
      context: ({ req }: { req: Request }) => ({ req }),
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    PolyLoggerModule.register('poly-core'),
    TeamsModule,
    OrganizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
