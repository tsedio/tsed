import {Model, MongooseNextCB, ObjectID, PostHook, PreHook, Ref, Schema, Unique} from "@tsed/mongoose";
import {CollectionOf, Groups, Ignore, MinLength, Property, Required} from "@tsed/schema";

@Schema({
  schemaOptions: {_id: false}
})
export class UserModuleData {
  @(CollectionOf(Number).MinItems(1))
  roles: number[];
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
export class TestUser {
  @ObjectID("id")
  @Groups("!creation")
  _id: string;

  @Required()
  @Unique()
  email: string;

  @Required()
  @MinLength(6)
  @Groups("creation")
  password: string;

  @Property()
  pre: string;

  @Property()
  post: string;

  @Property()
  current: UserModuleData;

  @CollectionOf(UserModuleData)
  data: Map<string, UserModuleData>;

  @Ignore((value, ctx) => ctx.endpoint)
  alwaysIgnored: string = "hello ignore";
}

@Model({name: "profile", schemaOptions: {timestamps: {createdAt: "created", updatedAt: "updated"}}})
export class TestProfile {

  @Property()
  image: string;

  @Property()
  age: number;

  @Ref(TestUser)
  user: Ref<TestUser>;
}

