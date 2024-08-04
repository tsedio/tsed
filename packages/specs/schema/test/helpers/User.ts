import {CollectionOf, Property} from "../../src/index.js";
import {Post} from "./Post.js";

export class User {
  @Property()
  name: string;

  @CollectionOf(() => Post)
  posts: Post[];
}
