import {Field, ID, ObjectType} from "type-graphql";

@ObjectType({description: "Object representing cooking recipe"})
export class Recipe {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field({nullable: true})
  description?: string;

  @Field()
  creationDate: Date;

  @Field((type) => [String])
  ingredients: string[];

  constructor(options: Partial<Recipe> = {}) {
    options.id && (this.id = options.id);
    options.title && (this.title = options.title);
    options.description && (this.description = options.description);
    options.creationDate && (this.creationDate = options.creationDate);
    options.ingredients && (this.ingredients = options.ingredients);
  }
}
