import {Controller} from "@tsed/di";
import {BodyParams} from "@tsed/platform-params";

import {CollectionOf, getSpec, Groups, Partial, Patch, Post, Required} from "../../src/index.js";

class Product {
  @Required()
  @Groups("!partial", "!create", "!update")
  id: string;

  @Required()
  title: string;
}

class Model {
  @Required()
  @Groups("!partial", "!create", "!update")
  id: string;

  @Required()
  title: string;

  @CollectionOf(Product)
  items: Product[];
}

@Controller("/")
class MyController {
  @Patch("/:id")
  patch(@BodyParams() @Partial() partial: Model) {}

  @Post("/:id")
  post(@BodyParams() model: Model) {}
}

describe("Partial", () => {
  it("should generate spec", () => {
    const spec = getSpec(MyController);

    expect(spec).toMatchSnapshot();
  });
});
