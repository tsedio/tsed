import {Controller} from "@tsed/di";
import {BodyParams, PathParams} from "@tsed/platform-params";
import {DiscriminatorKey, DiscriminatorValue, JsonParameterStore, OneOf, Property, Put, Required, Returns} from "@tsed/schema";

import {deserialize, serialize} from "../../src/index.js";

class Event {
  @DiscriminatorKey() // declare this property as discriminator key
  type: string;

  @Property()
  value: string;
}

class SubEvent extends Event {
  @Property()
  metaSub: string;
}

@DiscriminatorValue("page_view") // or @DiscriminatorValue() value can be inferred by the class name
class PageView extends SubEvent {
  @Required()
  url: string;
}

@DiscriminatorValue("action", "click_action")
class Action extends SubEvent {
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

type OneOfEvents = PageView | Action | CustomAction;

class Tracking {
  @OneOf(PageView, Action)
  data: PageView | Action;
}

class TrackingWithArray {
  @OneOf(PageView, Action)
  data: (PageView | Action)[];
}

class TrackingData {
  @OneOf(Event)
  data: OneOfEvents;
}

class TrackingWithArrayData {
  @OneOf(Event)
  data: OneOfEvents[];
}

describe("Discriminator", () => {
  describe("deserialize()", () => {
    it("should deserialize object according to the discriminator key (model with property discriminator)", () => {
      const list = {
        data: {
          type: "page_view",
          value: "value",
          url: "https://url",
          metaSub: "sub"
        }
      };
      const result = deserialize(list, {
        type: Tracking
      });

      expect(result).toEqual({
        data: {
          type: "page_view",
          metaSub: "sub",
          url: "https://url",
          value: "value"
        }
      });
      expect(result.data).toBeInstanceOf(PageView);
    });
    it("should deserialize object according to the discriminator key (model with property discriminator - array)", () => {
      const list = {
        data: [
          {
            type: "page_view",
            value: "value",
            url: "https://url",
            metaSub: "sub"
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
        ]
      };
      const result = deserialize(list, {
        type: TrackingWithArray
      });

      expect(result).toEqual({
        data: [
          {
            type: "page_view",
            metaSub: "sub",
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
        ]
      });
      expect(result.data[0]).toBeInstanceOf(PageView);
      expect(result.data[1]).toBeInstanceOf(Action);
      expect(result.data[2]).toBeInstanceOf(Action);
      expect(result.data[3]).toBeInstanceOf(CustomAction);
    });
    it("should deserialize object according to the discriminator key (list of item)", () => {
      const list = [
        {
          type: "base",
          value: "value"
        },
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
      ];
      const result = deserialize(list, {
        type: Event,
        collectionType: Array
      });

      expect(result).toEqual([
        {
          type: "base",
          value: "value"
        },
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
      expect(result[0]).toBeInstanceOf(Event);
      expect(result[1]).toBeInstanceOf(PageView);
      expect(result[2]).toBeInstanceOf(Action);
      expect(result[3]).toBeInstanceOf(Action);
      expect(result[4]).toBeInstanceOf(CustomAction);
    });
    it("should deserialize object according to the discriminator key (endpoint)", () => {
      @Controller("/")
      class Test {
        @Put("/:id")
        @(Returns(200).OneOf(Event))
        put(@PathParams(":id") id: string, @BodyParams() @OneOf(Event) event: OneOfEvents) {
          return [];
        }
      }

      const param = JsonParameterStore.get(Test, "put", 1);

      const result = deserialize(
        {
          type: "page_view",
          value: "value",
          url: "https://url"
        },
        {
          store: param
        }
      );

      expect(result).toBeInstanceOf(PageView);
    });
    it("should deserialize object according to the discriminator key for specific type (endpoint)", () => {
      @Controller("/")
      class Test {
        @Put("/:id")
        @Returns(200, Action)
        put(@PathParams(":id") id: string, @BodyParams() action: Action) {
          return [];
        }
      }

      const param = JsonParameterStore.get(Test, "put", 1);

      const result = deserialize(
        {
          type: "action",
          value: "value",
          url: "https://url"
        },
        {
          store: param
        }
      );

      expect(result).toBeInstanceOf(Action);
    });
    it("should deserialize object according to the discriminator key (endpoint - only base class resolved)", () => {
      class Base {
        @DiscriminatorKey() // declare this property as discriminator key
        type: string;

        @Property()
        value: string;
      }

      @Controller("/")
      class Test {
        @Put("/:id")
        @(Returns(200).OneOf(Event))
        put(@PathParams(":id") id: string, @BodyParams() @OneOf(Base) Base: any) {
          return [];
        }
      }

      const param = JsonParameterStore.get(Test, "put", 1);

      const result = deserialize(
        {
          type: "page_view",
          value: "value",
          url: "https://url"
        },
        {
          store: param
        }
      );

      expect(result).toBeInstanceOf(Base);
    });
    it("should deserialize object according to the discriminator key (endpoint - list)", () => {
      @Controller("/")
      class Test {
        @Put("/:id")
        @(Returns(200).OneOf(Event))
        put(@PathParams(":id") id: string, @BodyParams() @OneOf(Event) event: OneOfEvents[]) {
          return [];
        }
      }

      const param = JsonParameterStore.get(Test, "put", 1);

      const list = [
        {
          type: "base",
          value: "value"
        },
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
      ];

      const result = deserialize(list, {
        store: param
      });

      expect(result[0]).toBeInstanceOf(Event);
      expect(result[1]).toBeInstanceOf(PageView);
      expect(result[2]).toBeInstanceOf(Action);
      expect(result[3]).toBeInstanceOf(Action);
      expect(result[4]).toBeInstanceOf(CustomAction);
    });
  });
  describe("serialize()", () => {
    it("should serialize items", () => {
      const event = new Event();
      event.value = "value";

      const pageView = new PageView();
      pageView.value = "value";
      pageView.url = "url";

      const action = new Action();
      action.value = "value";
      action.event = "event";

      const list = [event, pageView, action];

      expect(serialize(list)).toEqual([
        {
          value: "value"
        },
        {
          type: "page_view",
          url: "url",
          value: "value"
        },
        {
          type: "action",
          event: "event",
          value: "value"
        }
      ]);
    });
    it('should serialize object with "OneOf" decorator', () => {
      const tracking = new TrackingData();
      tracking.data = new PageView();
      tracking.data.value = "value";
      tracking.data.url = "url";

      expect(serialize(tracking)).toEqual({
        data: {
          type: "page_view",
          url: "url",
          value: "value"
        }
      });
    });
    it('should serialize object with "OneOf" decorator (collection)', () => {
      const tracking = new TrackingWithArrayData();
      const pageView = new PageView();
      pageView.value = "value";
      pageView.url = "url";

      tracking.data = [pageView];

      expect(serialize(tracking)).toEqual({
        data: [
          {
            type: "page_view",
            url: "url",
            value: "value"
          }
        ]
      });
    });
  });
});
