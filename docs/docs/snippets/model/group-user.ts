import {CollectionOf, Groups, Required} from "@tsed/schema";

export class User {
  @Groups("!creation")
  id: string;

  @Required()
  firstName: string;

  @Required()
  lastName: string;

  @Required()
  @Groups("group.email", "creation")
  email: string;

  @Groups("creation")
  password: string;

  @CollectionOf(String)
  @Groups("group.roles")
  roles: string[];
}
