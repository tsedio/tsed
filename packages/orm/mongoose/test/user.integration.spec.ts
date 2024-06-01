import {TestMongooseContext} from "@tsed/testing-mongoose";
import faker from "@faker-js/faker";
import {MongooseModel} from "../src/interfaces/MongooseModel.js";
import {TestUser} from "./helpers/models/User.js";
import {Server} from "./helpers/Server.js";

describe("Mongoose", () => {
  describe("UserModel (di)", () => {
    beforeEach(TestMongooseContext.create);
    afterEach(TestMongooseContext.reset);

    it(
      "should run pre and post hook",
      TestMongooseContext.inject([TestUser], async (userModel: MongooseModel<TestUser>) => {
        // GIVEN
        const user = new userModel({
          email: "test@test.fr",
          password: faker.internet.password(12)
        });

        // WHEN
        await user.save();

        // THEN
        expect(user.email).toBe("test@test.fr");
        expect(user.password).toBe(user.password);

        expect(user.pre).toBe("hello pre");
        expect(user.post).toBe("hello post");
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
          email: "test@test.fr",
          password: faker.internet.password(12)
        });

        // WHEN
        await user.save();

        // THEN
        expect(user.pre).toBe("hello pre");
        expect(user.post).toBe("hello post");
      })
    );
  });
});
