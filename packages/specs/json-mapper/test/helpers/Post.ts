import {Property} from "@tsed/schema";

import type {User} from "./User.js";
export class Post {
  @Property()
  id: string;

  @Property()
  owner: User;
}
