import {Allow, Ignore, MinLength, Property, Required} from "@tsed/common";
import {Model, ObjectID, PostHook, PreHook, Unique} from "../../../src/decorators";

export class TestUserCreation {
  @ObjectID("id")
  _id: string;

  @Property()
  @Required()
  @Unique()
  email: string;

  @Required()
  @MinLength(6)
  @Allow(null)
  password: string;
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
export class TestUser extends TestUserCreation {
  @Ignore()
  password: string;

  @Property()
  pre: string;

  @Property()
  post: string;
}
