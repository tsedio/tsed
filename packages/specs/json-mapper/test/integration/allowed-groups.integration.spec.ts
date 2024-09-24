import {Controller} from "@tsed/di";
import {EndpointMetadata, Get, Groups, Property, Returns} from "@tsed/schema";

import {serialize} from "../../src/utils/serialize.js";

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

  @Get("/:id")
  @(Returns(200, MyModel).Groups("!admin").AllowedGroups("summary", "details"))
  get2() {
    return {
      id: "id",
      description: "description",
      prop1: "prop1",
      prop2: "prop2",
      sensitiveProp: "sensitiveProp"
    };
  }
}

function getSpecFixture(method: string, includes: undefined | string[]) {
  const data = new MyModel();
  data.id = "id";
  data.description = "description";
  data.prop1 = "prop1";
  data.prop2 = "prop2";
  data.sensitiveProp = "sensitiveProp";

  const endpoint = EndpointMetadata.get(MyController, method);

  return serialize(data, {
    useAlias: true,
    // additionalProperties: this.additionalProperties === "accept",
    ...endpoint.getResponseOptions(200, {includes}),
    endpoint: true
  });
}

describe("@AllowedGroups", () => {
  describe("without @Groups", () => {
    it("should serialize the model (no included groups - undefined)", () => {
      const spec = getSpecFixture("get", undefined);

      expect(spec).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1",
        prop2: "prop2",
        sensitiveProp: "sensitiveProp"
      });
    });

    it("should serialize the model (no included groups - [])", () => {
      const spec = getSpecFixture("get", []);

      expect(spec).toEqual({
        description: "description",
        id: "id"
      });
    });

    it("should serialize the model (included groups)", () => {
      const spec = getSpecFixture("get", ["summary"]);

      expect(spec).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1"
      });
    });

    it("should serialize the model (included groups + unexpected groups)", () => {
      const spec = getSpecFixture("get", ["summary", "admin"]);

      expect(spec).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1"
      });
    });
  });

  describe("with @Groups", () => {
    it("should serialize the model (no included groups - undefined)", () => {
      const spec = getSpecFixture("get2", undefined);

      expect(spec).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1",
        prop2: "prop2"
      });
    });

    it("should serialize the model (no included groups - [])", () => {
      const spec = getSpecFixture("get2", []);

      expect(spec).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1",
        prop2: "prop2"
      });
    });

    it("should serialize the model (included groups)", () => {
      const spec = getSpecFixture("get2", ["summary"]);

      expect(spec).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1"
      });
    });

    it("should serialize the model (included groups + unexpected groups)", () => {
      const spec = getSpecFixture("get2", ["summary", "admin"]);

      expect(spec).toEqual({
        description: "description",
        id: "id",
        prop1: "prop1"
      });
    });
  });
});
