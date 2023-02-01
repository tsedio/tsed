import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Server} from "./helpers/Server";
import {MongooseModel} from "../src/interfaces/MongooseModel";
import {Required} from "@tsed/schema";
import {ObjectID, DiscriminatorKey, Model} from "../src";

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

    @Model({discriminatorValue: "ClickedLinkEventModel"})
    class ClickedLinkEventModel extends EventModel {
      @Required()
      url: string;
    }

    @Model({discriminatorValue: "signUpEvent"})
    class SignedUpEventModel extends EventModel {
      @Required()
      user: string;
    }

    beforeEach(TestMongooseContext.bootstrap(Server));
    afterEach(TestMongooseContext.clearDatabase);
    afterEach(TestMongooseContext.reset);

    it("should save and retrieve models correctly", async () => {
      const eventModel = TestMongooseContext.get<MongooseModel<EventModel>>(EventModel);
      const clickedLinkEventModel = TestMongooseContext.get<MongooseModel<ClickedLinkEventModel>>(ClickedLinkEventModel);
      const signedUpEventModel = TestMongooseContext.get<MongooseModel<SignedUpEventModel>>(SignedUpEventModel);

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
