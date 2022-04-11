import {ArgsType, Field, Int} from "type-graphql";

@ArgsType()
export class RecipeArgs {
  @Field((type) => Int, {nullable: true})
  skip?: number;

  @Field((type) => Int, {nullable: true})
  take?: number;

  @Field({nullable: true})
  title?: string;
}
