import {CollectionOf, Property} from "@tsed/schema";

import {Post} from "./Post.js";

export class User {
  @Property()
  name: string;

  @CollectionOf(() => Post)
  posts: Post[];
}
