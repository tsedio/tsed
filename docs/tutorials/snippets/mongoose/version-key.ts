import {Model, ObjectID, VersionKey} from "@tsed/mongoose";
import {Required} from "@tsed/schema";

@Model()
class PostModel {
  @ObjectID()
  _id: string;

  @VersionKey()
  version: number;

  @Required()
  title: string;
}
