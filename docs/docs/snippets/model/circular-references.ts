import {CollectionOf, Groups, Property} from "@tsed/schema";

export class Photo {
  @Property(() => User)
  owner: User;
}

export class User {
  @CollectionOf(Photo)
  @Groups("group.roles")
  photos: Photo[];
}
