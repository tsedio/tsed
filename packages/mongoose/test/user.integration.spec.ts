import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import {MongooseModel} from "../src/interfaces";
import {TestRole, TestUser} from "./helpers/models/User";
import {Server} from "./helpers/Server";

describe("UserModel with context", () => {
  beforeEach(TestMongooseContext.create);
  afterEach(TestMongooseContext.reset);

  it("should run pre and post hook", TestMongooseContext.inject([TestUser], async (userModel: MongooseModel<TestUser>) => {
    // GIVEN
    const role = new TestRole();
    role.name = "name";
    const user = new userModel({
      email: "test@test.fr",
      role
    });

    // WHEN
    await user.save();

    // THEN
    expect(user.pre).to.equal("hello pre");
    expect(user.post).to.equal("hello post");
    // @ts-ignore
    expect(user.role.toObject()).to.deep.equal({name: "name"});
  }));
});

describe("UserModel with bootstrap", () => {
  beforeEach(TestMongooseContext.bootstrap(Server));
  afterEach(TestMongooseContext.clearDatabase);
  afterEach(TestMongooseContext.reset);

  it("should run pre and post hook", TestMongooseContext.inject([TestUser], async (userModel: MongooseModel<TestUser>) => {
    // GIVEN
    const user = new userModel({
      email: "test@test.fr",
      role: {
        name: "test"
      }
    });

    // WHEN
    await user.save();

    // THEN
    expect(user.pre).to.equal("hello pre");
    expect(user.post).to.equal("hello post");
  }));
});
