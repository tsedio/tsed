import {CollectionOf, Property} from "@tsed/schema";

export class Photo {
  @Property(() => User)
  owner: User;
}

export class User {
  @CollectionOf(Photo)
  photos: Photo[];
}
