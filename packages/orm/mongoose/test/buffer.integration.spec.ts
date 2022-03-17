import {TestMongooseContext} from "@tsed/testing-mongoose";
import axios from "axios";
import faker from "faker";
import {MongooseModel} from "../src/interfaces/MongooseModel";
import {TestAvatar} from "./helpers/models/Avatar";

describe("Mongoose", () => {
  describe("Models with Buffer", () => {
    beforeEach(TestMongooseContext.create);
    afterEach(TestMongooseContext.reset);

    it(
      "Should save and load buffer",
      TestMongooseContext.inject([TestAvatar], async (avatarModel: MongooseModel<TestAvatar>) => {
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
