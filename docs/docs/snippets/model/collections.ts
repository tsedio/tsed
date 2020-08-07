import {CollectionOf, getJsonSchema} from "@tsed/common";
import {Model} from "./primitives";
import {Role} from "./Role";
import {Security} from "./Security";

class User {
  @CollectionOf(Role)
  roles: Role[];

  @CollectionOf(String)
  securities: Map<string, Security>;

  @CollectionOf(String)
  scopes: Set<string>;
}

console.log(getJsonSchema(Model));
