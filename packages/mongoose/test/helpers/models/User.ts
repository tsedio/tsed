import {Property, Required} from "@tsed/common";
import {Model, ObjectID, PostHook, PreHook, Unique} from "../../../src/decorators";

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
}
