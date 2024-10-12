import {PlatformTest} from "@tsed/platform-http/testing";
import {DiscriminatorKey, DiscriminatorValue, Property, Required} from "@tsed/schema";

import {Adapter, Adapters, FileSyncAdapter} from "../src/index.js";

class Event {
  @DiscriminatorKey() // declare this property a discriminator key
  type: string;

  @Property()
  value: string;
}

class SubEvent extends Event {
  @Property()
  meta: string;
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

describe("Discriminator", () => {
  let adapter: Adapter<OneOfEvents>;
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  beforeEach(() => {
    adapter = PlatformTest.get<Adapters>(Adapters).invokeAdapter<any>({
      collectionName: "events",
      model: Event,
      adapter: FileSyncAdapter
    });
  });

  it("should store data and return the same type as expected", async () => {
    const item1 = new Action();
    item1.event = "action_event";
    item1.value = "value";
    item1.meta = "meta";

    const item2 = new CustomAction();
    item2.event = "custom_action";
    item2.value = "value";
    item2.meta = "meta2";

    await adapter.deleteMany({});

    await adapter.create(item1);
    await adapter.create(item2);

    const result = await adapter.findAll();

    expect(result).toEqual([
      {
        event: "action_event",
        meta: "meta",
        type: "action",
        value: "value"
      },
      {
        event: "custom_action",
        meta: "meta2",
        type: "custom_action",
        value: "value"
      }
    ]);

    expect(result[0]).toBeInstanceOf(Action);
    expect(result[1]).toBeInstanceOf(CustomAction);
  });
});
