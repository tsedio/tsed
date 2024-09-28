import {Property} from "@tsed/schema";

import {User} from "./User.js";
export class Post {
  @Property()
  id: string;

  @Property()
  owner: User;
}
