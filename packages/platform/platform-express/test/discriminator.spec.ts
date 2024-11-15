import "@tsed/ajv";
import {BodyParams, Controller, Patch, PlatformTest, Post} from "@tsed/common";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import {DiscriminatorKey, DiscriminatorValue, OneOf, Partial, Property, Required, Returns} from "@tsed/schema";
import "@tsed/swagger";
import SuperTest from "supertest";
import {PlatformExpress} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

class Event {
  @DiscriminatorKey() // declare this property as discriminator key
  type: string;

  @Property()
  value: string;
}

@DiscriminatorValue("page_view") // or @DiscriminatorValue() value can be inferred by the class name
class PageView extends Event {
  @Required()
  url: string;
}

@DiscriminatorValue("action", "click_action")
class Action extends Event {
  @Required()
  event: string;
}

@DiscriminatorValue()
class CustomAction extends Event {
  @Required()
  event: string;

  @Property()
  meta: string;
}

type EventTypes = PageView | Action | CustomAction;

@Controller("/discriminator")
class TestDiscriminator {
  @Post("/scenario-1")
  @Returns(200).OneOf(Event)
  scenario1(@BodyParams() @OneOf(Event) event: EventTypes) {
    expect(event).toBeInstanceOf(PageView);
    return event;
  }

  @Post("/scenario-2")
  @Returns(200, Array).OneOf(Event)
  scenario2(@BodyParams() @OneOf(Event) events: EventTypes[]) {
    expect(events[0]).toBeInstanceOf(PageView);
    expect(events[1]).toBeInstanceOf(Action);
    expect(events[2]).toBeInstanceOf(Action);
    expect(events[3]).toBeInstanceOf(CustomAction);
    return events;
  }

  @Patch("/scenario-3")
  @Returns(200).OneOf(Event)
  scenario3(@BodyParams() @OneOf(Event) @Partial() event: EventTypes) {
    expect(event).toBeInstanceOf(PageView);
    return event;
  }
}

const utils = PlatformTestSdk.create({
  rootDir,
  platform: PlatformExpress,
  server: Server
});
describe("Discriminator", () => {
  let request: SuperTest.Agent;

  beforeAll(
    utils.bootstrap({
      mount: {
        "/rest": [TestDiscriminator]
      },
      swagger: [
        {
          path: "/docs",
          specVersion: "3.0.1"
        }
      ]
    })
  );
  afterAll(utils.reset);

  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });

  describe("os3", () => {
    it("should generate the spec", async () => {
      const {body} = await request.get("/docs/swagger.json");
      expect(body).toMatchSnapshot();
    });
  });

  describe("POST /rest/discriminator: scenario 1", () => {
    it("should map correctly the data", async () => {
      const {body} = await request
        .post("/rest/discriminator/scenario-1")
        .send({
          type: "page_view",
          value: "value",
          url: "https://url.com"
        })
        //.expect(200);

      expect(body).toEqual({
        type: "page_view",
        url: "https://url.com",
        value: "value"
      });
    });
    it("should throw an error when the type doesn't exists", async () => {
      const {body} = await request
        .post("/rest/discriminator/scenario-1")
        .send({
          type: "test",
          value: "value",
          url: "https://url.com"
        })
        .expect(400);

      expect(body).toEqual({
        errors: [
          {
            requestPath: "body",
            data: {
              type: "test",
              url: "https://url.com",
              value: "value"
            },
            dataPath: "",
            instancePath: "",
            keyword: "discriminator",
            message: 'value of tag "type" must be in oneOf',
            params: {
              error: "mapping",
              tag: "type",
              tagValue: "test"
            },
            schemaPath: "#/discriminator"
          }
        ],
        message:
          'Bad request on parameter "request.body".\nValue value of tag "type" must be in oneOf. Given value: {"type":"test","value":"value","url":"https://url.com"}',
        name: "AJV_VALIDATION_ERROR",
        status: 400
      });
    });
  });

  describe("POST /rest/discriminator: scenario 2", () => {
    it("should map correctly the data", async () => {
      const result = await request
        .post("/rest/discriminator/scenario-2")
        .send([
          {
            type: "page_view",
            value: "value",
            url: "https://url"
          },
          {
            type: "action",
            value: "value",
            event: "event"
          },
          {
            type: "click_action",
            value: "value",
            event: "event"
          },
          {
            type: "custom_action",
            value: "custom",
            event: "event",
            meta: "meta"
          }
        ])
        .expect(200);

      expect(result.body).toEqual([
        {
          type: "page_view",
          url: "https://url",
          value: "value"
        },
        {
          event: "event",
          type: "action",
          value: "value"
        },
        {
          event: "event",
          type: "click_action",
          value: "value"
        },
        {
          event: "event",
          meta: "meta",
          type: "custom_action",
          value: "custom"
        }
      ]);
    });
  });

  describe("PATCH /rest/discriminator: scenario 3", () => {
    it("should map correctly the data", async () => {
      const result = await request.patch("/rest/discriminator/scenario-3").send({
        type: "page_view",
        value: "value",
        url: "https://url"
      });
      expect(result.body).toEqual({type: "page_view", url: "https://url", value: "value"});
    });
  });
});
