import {CollectionOf, getJsonSchema} from "@tsed/schema";
import {Model} from "./primitives";
import {Role} from "./Role";
import {Security} from "./Security";

class User {
  @CollectionOf(Role)
  roles: Role[];

  @CollectionOf(Security)
  securities: Map<string, Security>;

  @CollectionOf(String)
  scopes: Set<string>;
}

console.log(getJsonSchema(Model));
