import {faker} from "@faker-js/faker";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import axios from "axios";

import {MongooseModel} from "../src/interfaces/MongooseModel.js";
import {TestAvatar} from "./helpers/models/Avatar.js";

describe("Mongoose", () => {
  describe("Models with Buffer", () => {
    beforeEach(() => TestContainersMongo.create());
    afterEach(() => TestContainersMongo.reset());

    it("Should save and load buffer", async () => {
      const avatarModel = PlatformTest.get<MongooseModel<TestAvatar>>(TestAvatar);
      const imageBuffer = await axios
        .get(faker.image.avatarGitHub(), {
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
    });
  });
});
