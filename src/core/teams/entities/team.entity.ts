import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Team {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
