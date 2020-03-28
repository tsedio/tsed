import {DecoratorTypes} from "@tsed/core";
import {JsonEntityComponent} from "@tsed/schema";
import {JsonEntityStore} from "../../domain/JsonEntityStore";


describe("JsonEntityComponent", () => {
  it("should declare new JsonEntityComponent", () => {
    @JsonEntityComponent(DecoratorTypes.CLASS)
    class CustomEntity extends JsonEntityStore {

    }

    JsonEntityStore.entities.delete(DecoratorTypes.CLASS);
  });
});
