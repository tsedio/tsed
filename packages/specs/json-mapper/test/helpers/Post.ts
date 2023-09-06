import {Property} from "@tsed/schema";
import {User} from "./User";
export class Post {
  @Property()
  id: string;

  @Property()
  owner: User;
}
