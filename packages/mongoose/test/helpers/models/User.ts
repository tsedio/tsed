import {
  Model,
  MongooseDocument,
  MongooseNextCB,
  MongoosePostHookCB,
  ObjectID,
  PostHook,
  PreHook,
  Unique
} from "@tsed/mongoose";
import {Allow, Ignore, MinLength, Property, Required} from "@tsed/schema";

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
@PreHook("save", (user: TestUser, next: MongooseNextCB) => {
  user.pre = "hello pre";

  next();
})
@PostHook("save", (user: TestUser, next: MongooseNextCB): void => {
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
