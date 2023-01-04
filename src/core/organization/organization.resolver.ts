import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(() => Organization)
  createOrganization(
    @Args('createOrganizationInput')
    createOrganizationInput: CreateOrganizationInput,
  ) {
    return this.organizationService.create(createOrganizationInput);
  }

  @Query(() => [Organization], { name: 'organizations' })
  findAll() {
    return this.organizationService.findAll();
  }

  @Query(() => Organization, { name: 'organization' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.organizationService.findOne(id);
  }

  @Mutation(() => Organization)
  updateOrganization(
    @Args('updateOrganizationInput')
    updateOrganizationInput: UpdateOrganizationInput,
  ) {
    return this.organizationService.update(
      updateOrganizationInput.id,
      updateOrganizationInput,
    );
  }

  @Mutation(() => Organization)
  removeOrganization(@Args('id', { type: () => Int }) id: number) {
    return this.organizationService.remove(id);
  }
}
