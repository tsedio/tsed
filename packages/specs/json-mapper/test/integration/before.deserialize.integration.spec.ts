import {catchAsyncError} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import {Enum, Property} from "@tsed/schema";

import {BeforeDeserialize} from "../../src/decorators/beforeDeserialize.js";
import {deserialize} from "../../src/utils/deserialize.js";
import {FoodStatus} from "../helpers/FoodStatus.js";

@BeforeDeserialize((data: Record<string, unknown>) => {
  if (data.status === FoodStatus.EXPIRED || data.status === FoodStatus.MOLDY) {
    throw new BadRequest(`The food cannot be ${data.status}`);
  } else {
    data.name = `The ${data.name} is fresh`;
    return data;
  }
})
class Food {
  @Property()
  name: string;

  @Property()
  @Enum(FoodStatus)
  status: FoodStatus;
}

describe("BeforeDeserialize", () => {
  it("should deserialize object correctly and alter the name before deserialization", () => {
    // GIVEN
    const food: Food = {
      name: "Banana",
      status: FoodStatus.FRESH
    };

    // WHEN
    const foodAfterDeserialization = deserialize(food, {type: Food});

    // THEN
    expect(foodAfterDeserialization).toEqual({
      name: "The Banana is fresh",
      status: FoodStatus.FRESH
    });
  });

  it("should throw an BadRequest before deserialization", async () => {
    // GIVEN
    const food: Food = {
      name: "Salad",
      status: FoodStatus.MOLDY
    };

    // WHEN
    const badRequestError = await catchAsyncError(() => deserialize(food, {type: Food}));

    // THEN
    expect(badRequestError).toBeInstanceOf(BadRequest);
  });
});
