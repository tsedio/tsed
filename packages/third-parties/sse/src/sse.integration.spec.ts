import {Controller} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Context} from "@tsed/platform-params";
import {Get, getSpec, JsonEntityStore, Name, Returns} from "@tsed/schema";

import {EventStream} from "./decorators/eventStream.js";
import {EventStreamCtx} from "./decorators/eventStreamCtx.js";
import {EventStreamContext} from "./domain/EventStreamContext.js";

function make(eventStream: EventStreamCtx, cb: () => any) {
  let intervalId: ReturnType<typeof setInterval>;

  eventStream.on("close", () => {
    clearInterval(intervalId);
  });

  eventStream.on("end", () => {
    clearInterval(intervalId);
  });

  intervalId = setInterval(() => {
    // Ts.ED support Model serialization using json-mapper here
    eventStream.emit("event", cb());
  }, 200);
}

class Model {
  @Name("id")
  _id: string;
}

@Controller("/sse")
export class MyCtrl {
  @Get("/scenario1")
  @EventStream()
  scenario1(@EventStreamCtx() eventStream: EventStreamCtx) {
    make(eventStream, () => new Date());
  }

  @Get("/scenario2")
  @EventStream()
  scenario2(@EventStreamCtx() eventStream: EventStreamCtx) {
    make(eventStream, () => false);
  }

  @Get("/scenario3")
  @EventStream()
  scenario3(@EventStreamCtx() eventStream: EventStreamCtx) {
    make(eventStream, () => 0);
  }

  @Get("/scenario4")
  @EventStream()
  scenario4(@EventStreamCtx() eventStream: EventStreamCtx) {
    make(eventStream, () => ({
      date: new Date(),
      message: "Hello"
    }));
  }

  @Get("/scenario5")
  @EventStream()
  @(Returns(200).Type(Model))
  scenario5(@EventStreamCtx() eventStream: EventStreamCtx, @Context() $ctx: PlatformContext) {
    make(eventStream, () => {
      const model = new Model();
      model._id = new Date().toISOString();

      return model;
    });
  }
}

async function getControllerFixture(scenario: string) {
  const controller = await PlatformTest.invoke<MyCtrl>(MyCtrl);

  const endpoint = JsonEntityStore.fromMethod(MyCtrl, scenario);
  const $ctx = PlatformTest.createRequestContext({
    endpoint
  });
  const eventStream = new EventStreamContext({
    $ctx
  });

  return {controller, endpoint, eventStream, $ctx};
}

describe("SSE integration", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ["Date"],
      now: new Date("2025-01-01T00:00:00Z").getTime()
    });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("should generate the swagger spec", () => {
    expect(getSpec(MyCtrl)).toMatchSnapshot();
  });

  describe("Scenario1 - Date/String", () => {
    it("should pass the new EventStreamContext to function and process message", async () => {
      const {controller, eventStream} = await getControllerFixture("scenario1");

      controller.scenario1(eventStream);

      // Wait for the first message
      const result = await new Promise((resolve) => {
        eventStream.on("data", resolve);
      });

      expect(result).toEqual("event: event\ndata: " + JSON.stringify(new Date()) + "\n\n");

      // stop the interval
      eventStream.end();
    });
  });

  describe("Scenario2 - Boolean", () => {
    it("should pass the new EventStreamContext to function and process message", async () => {
      const {controller, eventStream} = await getControllerFixture("scenario2");

      controller.scenario2(eventStream);

      // Wait for the first message
      const result = await new Promise((resolve) => {
        eventStream.on("data", resolve);
      });

      expect(result).toEqual("event: event\ndata: false\n\n");

      // stop the interval
      eventStream.end();
    });
  });

  describe("Scenario3 - Number", () => {
    it("should pass the new EventStreamContext to function and process message", async () => {
      const {controller, eventStream} = await getControllerFixture("scenario3");

      controller.scenario3(eventStream);

      // Wait for the first message
      const result = await new Promise((resolve) => {
        eventStream.on("data", resolve);
      });

      expect(result).toEqual("event: event\ndata: 0\n\n");

      // stop the interval
      eventStream.end();
    });
  });

  describe("Scenario4 - Object", () => {
    it("should pass the new EventStreamContext to function and process message", async () => {
      const {controller, eventStream} = await getControllerFixture("scenario4");

      controller.scenario4(eventStream);

      // Wait for the first message
      const result = await new Promise((resolve) => {
        eventStream.on("data", resolve);
      });

      expect(result).toEqual(
        "event: event\ndata: " +
          JSON.stringify({
            date: "2025-01-01T00:00:00.000Z",
            message: "Hello"
          }) +
          "\n\n"
      );

      // stop the interval
      eventStream.end();
    });
  });

  describe("Scenario5 - Model", () => {
    it("should pass the new EventStreamContext to function and process message", async () => {
      const {controller, eventStream, $ctx} = await getControllerFixture("scenario5");

      controller.scenario5(eventStream, $ctx);

      // Wait for the first message
      const result = await new Promise((resolve) => {
        eventStream.on("data", resolve);
      });

      expect(result).toEqual(
        "event: event\ndata: " +
          JSON.stringify({
            id: "2025-01-01T00:00:00.000Z"
          }) +
          "\n\n"
      );

      // stop the interval
      eventStream.end();
    });
  });
});
