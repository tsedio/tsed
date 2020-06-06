import {PlatformTest, Property, Required} from "@tsed/common";
import {Model, MongooseModel, ObjectID, PostHook, PreHook, Unique} from "@tsed/mongoose";
import {TestMongooseContext} from "@tsed/testing-mongoose";

@Model({schemaOptions: {timestamps: true}})
@PreHook("save", (user: UserModel, next: any) => {
  user.pre = "hello pre";

  next();
})
@PostHook("save", (user: UserModel, next: any) => {
  user.post = "hello post";

  next();
})
export class UserModel {
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

  it("should run pre and post hook", async () => {
    const userModel = PlatformTest.get<MongooseModel<UserModel>>(UserModel);

    // GIVEN
    const user = new userModel({
      email: "test@test.fr"
    });

    // WHEN
    await user.save();

    // THEN
    expect(user.pre).toEqual("hello pre");
    expect(user.post).toEqual("hello post");
  });
});
