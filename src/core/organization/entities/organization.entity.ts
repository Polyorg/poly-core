import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Organization {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}