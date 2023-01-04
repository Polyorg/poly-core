import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateTeamInput } from './create-team.input';

@InputType()
export class UpdateTeamInput extends PartialType(CreateTeamInput) {
  @Field(() => Int)
  id: number;
}
