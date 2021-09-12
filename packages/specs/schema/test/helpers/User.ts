import {CollectionOf} from "../../src/decorators/collections/collectionOf";
import {Property} from "../../src/decorators/common/property";
import {Post} from "./Post";

export class User {
  @Property()
  name: string;

  @CollectionOf(() => Post)
  posts: Post[];
}
