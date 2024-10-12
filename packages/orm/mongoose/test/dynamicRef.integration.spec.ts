import {deserialize, serialize} from "@tsed/json-mapper";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Enum, getJsonSchema, Required} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";

import {Model} from "../src/decorators/model.js";
import {DynamicRef, MongooseModel, ObjectID} from "../src/index.js";

describe("DynamicRef Integration", () => {
  @Model()
  class ClickedLinkEventModel {
    @ObjectID("id")
    _id: string;

    @Required()
    url: string;
  }

  @Model()
  class SignedUpEventModel {
    @ObjectID("id")
    _id: string;

    @Required()
    user: string;
  }

  @Model()
  class EventModel {
    @ObjectID("id")
    _id: string;

    @DynamicRef("eventType", ClickedLinkEventModel, SignedUpEventModel)
    event: DynamicRef<ClickedLinkEventModel | SignedUpEventModel>;

    @Enum("ClickedLinkEventModel", "SignedUpEventModel")
    eventType: "ClickedLinkEventModel" | "SignedUpEventModel";
  }

  beforeEach(() => TestContainersMongo.create());
  afterEach(() => TestContainersMongo.reset());

  describe("JsonSchema", () => {
    it("should return the json schema", () => {
      expect(getJsonSchema(EventModel)).toEqual({
        definitions: {
          ClickedLinkEventModel: {
            properties: {
              id: {
                description: "An ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                pattern: "^[0-9a-fA-F]{24}$",
                type: "string"
              },
              url: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["url"],
            type: "object"
          },
          SignedUpEventModel: {
            properties: {
              id: {
                description: "An ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                pattern: "^[0-9a-fA-F]{24}$",
                type: "string"
              },
              user: {
                minLength: 1,
                type: "string"
              }
            },
            required: ["user"],
            type: "object"
          }
        },
        properties: {
          event: {
            description: "A reference ObjectID",
            examples: ["5ce7ad3028890bd71749d477"],
            oneOf: [
              {
                description: "A reference ObjectID",
                examples: ["5ce7ad3028890bd71749d477"],
                type: "string"
              },
              {
                $ref: "#/definitions/ClickedLinkEventModel"
              },
              {
                $ref: "#/definitions/SignedUpEventModel"
              }
            ]
          },
          eventType: {
            enum: ["ClickedLinkEventModel", "SignedUpEventModel"],
            type: "string"
          },
          id: {
            description: "An ObjectID",
            examples: ["5ce7ad3028890bd71749d477"],
            pattern: "^[0-9a-fA-F]{24}$",
            type: "string"
          }
        },
        type: "object"
      });
    });
  });

  describe("serialize()", () => {
    it("should serialize (clickedEvent)", async () => {
      const EventRepository = PlatformTest.get<MongooseModel<EventModel>>(EventModel);
      const ClickedEventRepository = PlatformTest.get<MongooseModel<ClickedLinkEventModel>>(ClickedLinkEventModel);

      const clickedEvent = await new ClickedEventRepository({url: "https://www.tsed.io"}).save();
      const event1 = await new EventRepository({eventType: "ClickedLinkEventModel", event: clickedEvent}).save();

      const result1 = serialize(event1, {type: EventModel});

      expect(result1).toEqual({
        id: event1.id,
        eventType: "ClickedLinkEventModel",
        event: {id: clickedEvent.id, url: "https://www.tsed.io"}
      });
    });
    it("should serialize (SignedUpEventModel)", async () => {
      const EventRepository = PlatformTest.get<MongooseModel<EventModel>>(EventModel);
      const SignedUpEventRepository = PlatformTest.get<MongooseModel<SignedUpEventModel>>(SignedUpEventModel);

      const signedUpEvent = await new SignedUpEventRepository({user: "test"}).save();
      const event = await new EventRepository({eventType: "SignedUpEventModel", event: signedUpEvent}).save();

      const result = serialize(event, {type: EventModel});

      expect(result).toStrictEqual({
        id: event.id,
        eventType: "SignedUpEventModel",
        event: {id: signedUpEvent.id, user: "test"}
      });
    });
  });
  describe("deserialize()", () => {
    it("should serialize (clickedEvent)", () => {
      const result = deserialize<EventModel>(
        {
          id: "6229a38b4e23ac98aad216d6",
          eventType: "ClickedLinkEventModel",
          event: {id: "6229a38b4e23ac98aad216d5", url: "https://www.tsed.io"}
        },
        {type: EventModel}
      );

      expect(result).toEqual({
        _id: "6229a38b4e23ac98aad216d6",
        event: {
          _id: "6229a38b4e23ac98aad216d5",
          url: "https://www.tsed.io"
        },
        eventType: "ClickedLinkEventModel"
      });
      expect(result.event).toBeInstanceOf(ClickedLinkEventModel);
    });
  });
});
