import {Property, Required} from "@tsed/common";
import {Model, MongooseModel, ObjectID, PostHook, PreHook, Unique} from "@tsed/mongoose";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";

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

describe("UserModel", () => {
  beforeEach(TestMongooseContext.create);
  afterEach(TestMongooseContext.reset);

  it("should run pre and post hook", TestMongooseContext.inject([TestUser], async (userModel: MongooseModel<TestUser>) => {
    // GIVEN
    const user = new userModel({
      email: "test@test.fr"
    });

    // WHEN
    await user.save();

    // THEN
    expect(user.pre).to.equal("hello pre");
    expect(user.post).to.equal("hello post");
  }));
});
