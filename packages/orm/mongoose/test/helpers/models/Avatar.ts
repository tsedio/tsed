import {Property} from "@tsed/schema";

import {Model, ObjectID} from "../../../src/index.js";

@Model({schemaOptions: {timestamps: true}})
export class TestAvatar {
  @ObjectID()
  _id: string;

  @Property(Buffer)
  image: Buffer;
}
