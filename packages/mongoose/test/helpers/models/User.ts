import {Property, Required} from "@tsed/common";
import {Model, MongooseSchema, ObjectID, PostHook, PreHook, Unique} from "../../../src/decorators";

@MongooseSchema({schemaOptions: {_id: false}})
export class TestRole {
  @Property()
  name: string;
}

@Model({schemaOptions: {timestamps: true}})
@PreHook("save", (user: TestUser, next: any) => {
  user.pre = "hello pre";

  next();
})
@PostHook("save", (user: TestUser, next: any) => {
  user.post = "hello post";

  next();
})
export class TestUser {
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @Unique()
  email: string;

  @Property()
  pre: string;

  @Property()
  post: string;

  @Property()
  role: TestRole;
}
