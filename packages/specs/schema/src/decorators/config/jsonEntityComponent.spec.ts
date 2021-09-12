import {DecoratorTypes} from "@tsed/core";
import {JsonEntityComponent} from "@tsed/schema";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntitiesContainer} from "../../registries/JsonEntitiesContainer";

describe("JsonEntityComponent", () => {
  it("should declare new JsonEntityComponent", () => {
    @JsonEntityComponent(DecoratorTypes.CLASS)
    class CustomEntity extends JsonEntityStore {}

    JsonEntitiesContainer.delete(DecoratorTypes.CLASS);
  });
});
