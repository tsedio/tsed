import {MongooseModel} from "../src/interfaces/MongooseModel.js";
import {PlatformTest} from "@tsed/platform-http/testing";
import {TestAvatar} from "./helpers/models/Avatar.js";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import axios from "axios";
import {faker} from "@faker-js/faker";

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
