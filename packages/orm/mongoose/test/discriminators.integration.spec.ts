import {PlatformTest} from "@tsed/platform-http/testing";
import {DiscriminatorValue, Required} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {DiscriminatorKey, Model, MongooseModel, ObjectID} from "../src/index.js";

describe("Mongoose", () => {
  describe("Discriminators", () => {
    @Model()
    class EventModel {
      @ObjectID()
      _id: string;

      @Required()
      time: Date = new Date();

      @DiscriminatorKey()
      type: string;
    }

    @Model()
    @DiscriminatorValue("ClickedLinkEventModel")
    class ClickedLinkEventModel extends EventModel {
      @Required()
      url: string;
    }

    @Model()
    @DiscriminatorValue("signUpEvent")
    class SignedUpEventModel extends EventModel {
      @Required()
      user: string;
    }

    beforeEach(() => TestContainersMongo.create());
    afterEach(() => TestContainersMongo.reset());

    it("should save and retrieve models correctly", async () => {
      const eventModel = PlatformTest.get<MongooseModel<EventModel>>(EventModel);
      const clickedLinkEventModel = PlatformTest.get<MongooseModel<ClickedLinkEventModel>>(ClickedLinkEventModel);
      const signedUpEventModel = PlatformTest.get<MongooseModel<SignedUpEventModel>>(SignedUpEventModel);

      const date = new Date();
      const savedEventModel = await eventModel.create({time: date});
      const savedClickedLinkEventModel = await clickedLinkEventModel.create({time: date, url: "https://www.tsed.io"});
      const savedSignedUpEventModel = await signedUpEventModel.create({time: date, user: "usario"});

      expect(savedEventModel.time).toBe(date);
      expect(savedEventModel.type).toBeUndefined();
      expect(savedClickedLinkEventModel.time).toBe(date);
      expect(savedClickedLinkEventModel.type).toBe("ClickedLinkEventModel");
      expect(savedClickedLinkEventModel.url).toBe("https://www.tsed.io");
      expect(savedSignedUpEventModel.time).toBe(date);
      expect(savedSignedUpEventModel.type).toBe("signUpEvent");
      expect(savedSignedUpEventModel.user).toBe("usario");

      const retrievedEventModel = await eventModel.findById(savedEventModel.id);
      const retrievedClickedLinkEventModel = await eventModel.findById(savedClickedLinkEventModel.id);
      const retrievedSignedUpEventModel = await eventModel.findById(savedSignedUpEventModel.id);

      expect(retrievedEventModel?.toClass()).toBeInstanceOf(EventModel);
      expect(retrievedClickedLinkEventModel?.toClass()).toBeInstanceOf(ClickedLinkEventModel);
      expect(retrievedSignedUpEventModel?.toClass()).toBeInstanceOf(SignedUpEventModel);
    });
  });
});
