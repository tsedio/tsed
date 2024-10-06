import {EventSubscriber} from "@mikro-orm/core";
import {Store} from "@tsed/core";

import {DEFAULT_CONTEXT_NAME, SUBSCRIBER_INJECTION_TYPE} from "../constants.js";
import {Subscriber} from "./subscriber.js";

@Subscriber()
export class Subscriber1 implements EventSubscriber {}

@Subscriber({contextName: "non-default"})
export class Subscriber2 implements EventSubscriber {}

describe("@Subscriber", () => {
  it("should decorate the class", () => {
    // act
    const result = Store.from(Subscriber1).get(SUBSCRIBER_INJECTION_TYPE);
    // assert
    expect(result).toEqual({contextName: DEFAULT_CONTEXT_NAME});
  });

  it("should decorate the class tying a context name to it", () => {
    // act
    const result = Store.from(Subscriber2).get(SUBSCRIBER_INJECTION_TYPE);
    // assert
    expect(result).toEqual({contextName: "non-default"});
  });
});
