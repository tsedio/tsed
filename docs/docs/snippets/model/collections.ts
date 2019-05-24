import {PropertyType} from "@tsed/common";
import {Role} from "./Role";
import {Security} from "./Security";

class User {
  @PropertyType(Role)
  roles: Role[];

  @PropertyType(String)
  securities: Map<string, Security>;

  @PropertyType(String)
  scopes: Set<string>;
}
