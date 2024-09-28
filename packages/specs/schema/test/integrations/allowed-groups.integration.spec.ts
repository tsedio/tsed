import {Controller} from "@tsed/di";

import {Get, getSpec, Groups, Property, Returns} from "../../src/index.js";

class MyModel {
  @Property()
  id: string;

  @Property()
  description: string;

  @Groups("summary")
  prop1: string; // not display by default

  @Groups("details")
  prop2: string; // not display by default

  @Groups("admin")
  sensitiveProp: string; // not displayed because it's a sensitive props
}

@Controller("/controllers")
class MyController {
  @Get("/:id")
  @(Returns(200, MyModel).AllowedGroups("summary", "details"))
  get() {
    return {
      id: "id",
      description: "description",
      prop1: "prop1",
      prop2: "prop2",
      sensitiveProp: "sensitiveProp"
    };
  }
}

describe("@AllowedGroups", () => {
  it("should generate the expected schema without group", () => {
    const spec = getSpec(MyController, {});

    expect(spec).toMatchSnapshot();
  });

  it("should generate the schema with allowed group and filter unexpected group", () => {
    const spec = getSpec(MyController, {
      groups: ["summary", "details", "admin"]
    });

    expect(spec).toMatchSnapshot();
  });
});
