import {Model, ObjectID} from "../../../src/index.js";
import {Property} from "@tsed/schema";

@Model({schemaOptions: {timestamps: true}})
export class TestAvatar {
  @ObjectID()
  _id: string;

  @Property(Buffer)
  image: Buffer;
}
