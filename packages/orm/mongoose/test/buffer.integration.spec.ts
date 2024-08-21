import {TestMongooseContext} from "@tsed/testing-mongoose";
import axios from "axios";
import faker from "@faker-js/faker";
import {MongooseModel} from "../src/interfaces/MongooseModel.js";
import {TestAvatar} from "./helpers/models/Avatar.js";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import {PlatformTest} from "@tsed/common";

describe("Mongoose", () => {
  describe("Models with Buffer", () => {
    beforeEach(() => TestContainersMongo.create());
    afterEach(() => TestContainersMongo.reset());

    it(
      "Should save and load buffer",
      PlatformTest.inject([TestAvatar], async (avatarModel: MongooseModel<TestAvatar>) => {
        const imageBuffer = await axios
          .get(faker.image.people(256, 256), {
            responseType: "arraybuffer"
          })
          .then((response) => Buffer.from(response.data, "binary"));

        // GIVEN
        const newAvatar = new avatarModel({
          image: imageBuffer
        });

        // WHEN
        await newAvatar.save();
        const savedAvatar = await avatarModel.findById(newAvatar.id);

        // THEN
        expect(savedAvatar).not.toBeNull();
        if (savedAvatar) {
          expect(savedAvatar.image).toBeInstanceOf(Buffer);
        }
      })
    );
  });
});
