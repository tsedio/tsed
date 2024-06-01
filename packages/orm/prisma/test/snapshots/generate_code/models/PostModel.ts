import {Post} from "../client.js";
import {Integer, Required, Property, Allow} from "@tsed/schema";
import {UserModel} from "./UserModel.js";

export class PostModel implements Post {
  @Property(Number)
  @Integer()
  @Required()
  id: number;

  @Property(() => UserModel)
  @Allow(null)
  user: UserModel | null;

  @Property(Number)
  @Integer()
  @Allow(null)
  userId: number | null;
}
