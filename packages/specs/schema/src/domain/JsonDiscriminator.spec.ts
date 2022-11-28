import {DiscriminatorValue} from "../decorators/class/discriminatorValue";
import {DiscriminatorKey} from "../decorators/common/discriminatorKey";
import {Property} from "../decorators/common/property";
import {Required} from "../decorators/common/required";
import {JsonEntityStore} from "./JsonEntityStore";

class Event {
  @DiscriminatorKey() // declare this property a discriminator key
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

describe("Discriminator", () => {
  describe("getType()", () => {
    it("should return the expected type", () => {
      const discriminator = JsonEntityStore.from(Event).schema.discriminator();

      expect(discriminator.getType("custom_action")).toEqual(CustomAction);
      expect(discriminator.getType("")).toEqual(Event);
    });
  });

  describe("getValues()", () => {
    it("should return the expected values", () => {
      const discriminator = JsonEntityStore.from(Event).schema.discriminator();

      expect(discriminator.getValues(CustomAction)).toEqual(["custom_action"]);
      expect(discriminator.getValues(Event)).toEqual(undefined);
      expect(discriminator.getValues(Action)).toEqual(["action", "click_action"]);
    });
  });

  describe("getDefaultValue()", () => {
    it("should return the expected value", () => {
      const discriminator = JsonEntityStore.from(Event).schema.discriminator();

      expect(discriminator.getDefaultValue(CustomAction)).toEqual("custom_action");
      expect(discriminator.getDefaultValue(Event)).toEqual(undefined);
      expect(discriminator.getDefaultValue(Action)).toEqual("action");
    });
  });
});
