import {Model, MongooseNextCB, ObjectID, PostHook, PreHook, Ref, Schema, Unique} from "@tsed/mongoose";
import {CollectionOf, Groups, Ignore, MinLength, Property, Required} from "@tsed/schema";
import next from "ajv/dist/vocabularies/next";
import {options} from "superagent";

export class BaseModel {
  @ObjectID("id")
  @Groups("!creation")
  _id: string;

  @Property()
  created: Date;

  @Property()
  updated: Date;
}

@Schema({
  schemaOptions: {_id: false}
})
export class UserModuleData {
  @CollectionOf(Number).MinItems(1)
  roles: number[];
}

@Model({schemaOptions: {timestamps: {createdAt: "created", updatedAt: "updated"}}})
@PreHook("save", (user: TestUser, next: MongooseNextCB) => {
  user.pre = "hello pre";

  next();
})
@PreHook("save", async (user: TestUser) => {
  user.pre = "hello pre";
})
@PostHook("save", (user: TestUser, next: MongooseNextCB): void => {
  user.post = "hello post";

  next();
})
export class TestUser extends BaseModel {
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

  @Ignore((value, ctx) => {
    return ctx.endpoint;
  })
  @Ref(() => TestUser)
  @CollectionOf(() => TestUser)
  dataScope: Map<string, Ref<TestUser>>;

  @Ignore((value, ctx) => ctx.endpoint)
  alwaysIgnored: string = "hello ignore";
}

@Model({name: "profile", schemaOptions: {timestamps: {createdAt: "created", updatedAt: "updated"}}})
export class TestProfile extends BaseModel {
  @Property()
  image: string;

  @Property()
  age: number;

  @Ref(TestUser)
  user: Ref<TestUser>;
}

@Model({schemaOptions: {timestamps: true}})
export class SelfUser {
  @ObjectID()
  _id: string;

  @Ref(() => SelfUser)
  createdBy: Ref<SelfUser>;
}

@Model({name: "role", schemaOptions: {timestamps: {createdAt: "created", updatedAt: "updated"}}})
export class TestRole extends BaseModel {
  @Property()
  name: string;

  @Property()
  description: string;
}

@Model({name: "usernew", schemaOptions: {timestamps: {createdAt: "created", updatedAt: "updated"}}})
export class TestUserNew extends BaseModel {
  @Property()
  name: string;

  @Ref(TestRole)
  roles: Ref<TestRole>[];
}
