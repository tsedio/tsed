import {serialize} from "@tsed/json-mapper";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
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

    @Model()
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
      expect(savedEventModel.time).to.eq(date);
      expect(savedEventModel.type).to.eq(undefined);
      expect(savedClickedLinkEventModel.time).to.eq(date);
      expect(savedClickedLinkEventModel.type).to.eq("ClickedLinkEventModel");
      expect(savedClickedLinkEventModel.url).to.eq("https://www.tsed.io");
      expect(savedSignedUpEventModel.time).to.eq(date);
      expect(savedSignedUpEventModel.type).to.eq("signUpEvent");
      expect(savedSignedUpEventModel.user).to.eq("usario");

      const retrievedEventModel = await eventModel.findById(savedEventModel.id);
      const retrievedClickedLinkEventModel = await eventModel.findById(savedClickedLinkEventModel.id);
      const retrievedSignedUpEventModel = await eventModel.findById(savedSignedUpEventModel.id);
      expect(retrievedEventModel.toClass() instanceof EventModel).to.be.true;
      expect(retrievedClickedLinkEventModel.toClass() instanceof ClickedLinkEventModel).to.be.true;
      expect(retrievedSignedUpEventModel.toClass() instanceof SignedUpEventModel).to.be.true;
    });
  });
});
