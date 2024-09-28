import faker from "@faker-js/faker";
import {PlatformTest} from "@tsed/common";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {MongooseModel} from "../src/interfaces/MongooseModel.js";
import {TestUser} from "./helpers/models/User.js";

describe("Mongoose", () => {
  describe("UserModel (di)", () => {
    beforeEach(() => TestContainersMongo.create());
    afterEach(() => TestContainersMongo.reset());

    it(
      "should run pre and post hook",
      PlatformTest.inject([TestUser], async (userModel: MongooseModel<TestUser>) => {
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
    beforeEach(() => TestContainersMongo.create());
    afterEach(() => TestContainersMongo.reset());

    it(
      "should run pre and post hook",
      PlatformTest.inject([TestUser], async (userModel: MongooseModel<TestUser>) => {
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
