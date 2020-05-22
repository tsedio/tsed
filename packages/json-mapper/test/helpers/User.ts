import {CollectionOf, Property} from "@tsed/schema";
import {Post} from "./Post";

export class User {
  @Property()
  name: string;

  @CollectionOf(() => Post)
  posts: Post[];
}
