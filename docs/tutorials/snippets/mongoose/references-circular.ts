import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {Required} from "@tsed/schema";

@Model()
export class User {
  @ObjectID("id")
  _id: string;

  @Required()
  name: string;

  @Ref("Workspace") // Give workspace as string.
  workspace: Ref<Workspace>;
}

@Model()
export class Workspace {
  @ObjectID("id")
  _id: string;

  @Required()
  name: string;

  @Ref(User)
  createdBy: Ref<User>;
}
