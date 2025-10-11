import {CollectionOf, s} from "@tsed/schema";
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

export const MySchema = s.object({
  roles: s.array().items(Role),
  securities: s.map().additionalProperties(Security),
  scopes: s.set().items(s.string())
});