import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import {MongooseModel} from "../src/interfaces";
import {TestUser} from "./helpers/models/User";
import {Server} from "./helpers/Server";

describe("Mongoose", () => {
  describe("UserModel", () => {
    beforeEach(TestMongooseContext.create);
    afterEach(TestMongooseContext.reset);

    it(
      "should run pre and post hook",
      TestMongooseContext.inject([TestUser], async (userModel: MongooseModel<TestUser>) => {
        // GIVEN
        const user = new userModel({
          email: "test@test.fr",
          password: "test"
        });

        // WHEN
        await user.save();

        // THEN
        expect(user.email).to.equal("test@test.fr");
        expect(user.password).to.equal("test");

        expect(user.pre).to.equal("hello pre");
        expect(user.post).to.equal("hello post");
      })
    );
  });

  describe("UserModel", () => {
    beforeEach(TestMongooseContext.bootstrap(Server));
    afterEach(TestMongooseContext.clearDatabase);
    afterEach(TestMongooseContext.reset);

    it(
      "should run pre and post hook",
      TestMongooseContext.inject([TestUser], async (userModel: MongooseModel<TestUser>) => {
        // GIVEN
        const user = new userModel({
          email: "test@test.fr"
        });

        // WHEN
        await user.save();

        // THEN
        expect(user.pre).to.equal("hello pre");
        expect(user.post).to.equal("hello post");
      })
    );
  });
});
