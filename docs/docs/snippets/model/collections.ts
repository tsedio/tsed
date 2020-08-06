import {CollectionOf} from "@tsed/common";
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
