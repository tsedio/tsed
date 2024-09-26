import {Property} from "../../src/index.js";
import type {User} from "./User.js";

export class Post {
  @Property()
  id: string;

  @Property()
  owner: User;
}
