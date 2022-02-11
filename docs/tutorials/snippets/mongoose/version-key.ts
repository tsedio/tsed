import {Required} from "@tsed/schema";
import {Model, ObjectID, VersionKey} from "@tsed/mongoose";

@Model()
class PostModel {
  @ObjectID()
  _id: string;

  @VersionKey()
  version: number;

  @Required()
  title: string;
}
