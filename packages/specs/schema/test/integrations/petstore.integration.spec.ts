import "../../src/index.js";

import {Controller} from "@tsed/di";
import {Use} from "@tsed/platform-middlewares";
import {BodyParams, PathParams} from "@tsed/platform-params";

import {
  CollectionOf,
  Delete,
  Description,
  Enum,
  Example,
  Get,
  getSpec,
  Groups,
  Name,
  Partial,
  Patch,
  Post,
  Property,
  Publish,
  Put,
  Required,
  Returns,
  SpecTypes,
  Subscribe
} from "../../src/index.js";

class PetCategory {
  @Required()
  @Groups("!partial", "!create", "!update")
  id: string;

  @Required()
  @Example("doggie")
  name: string;
}

enum PetStatus {
  AVAILABLE = "available",
  PENDING = "pending",
  SOLD = "sold"
}

class Pet {
  @Required()
  @Groups("!partial", "!create", "!update")
  id: string;

  @Required()
  @Example("doggie")
  name: string;

  @Property()
  category: PetCategory;

  @CollectionOf(String)
  tags: string[];

  @Enum(PetStatus)
  status: PetStatus;
}

@Controller("/")
@Name("PetStore")
class PetController {
  @Use("/")
  middleware(@PathParams("id") id: string) {}

  @Get("/:id")
  @Publish("pet.get")
  @Subscribe("pet.get")
  @(Returns(200, Pet).Description("Returns a pet"))
  @Returns(404)
  get(@PathParams("id") id: string) {
    return null;
  }

  @Get("/")
  @Publish("pet.getAll")
  @Subscribe("pet.getAll")
  @(Returns(200, Array).Of(Pet).Description("Returns all pets"))
  getAll() {
    return [];
  }

  @Patch("/:id")
  @Publish("pet.patch")
  @Subscribe("pet.updated")
  @(Returns(200, Pet).Description("Returns a pet"))
  @Returns(404)
  @Description("Patch a pet")
  patch(@PathParams("id") id: string, @BodyParams() @Partial() partial: Pet) {
    return null;
  }

  @Post("/:id")
  @Publish("pet.update")
  @Subscribe("pet.created")
  @(Returns(200, Pet).Description("Returns a pet"))
  @Returns(404)
  @Description("Update a pet")
  post(@BodyParams() @Groups("update") pet: Pet) {
    return null;
  }

  @Put("/")
  @Publish("pet.create")
  @Subscribe("pet.updated")
  @Returns(201, Pet)
  @Returns(404)
  @Description("Create a pet")
  put(@BodyParams() @Groups("create") pet: Pet) {
    return null;
  }

  @Delete("/:id")
  @Publish("pet.delete")
  @Subscribe("pet.deleted")
  @Returns(204)
  @Returns(404)
  @Description("Delete a pet")
  delete(@PathParams("id") id: string) {
    return null;
  }
}

describe("PetStore", () => {
  describe("OpenSpec", () => {
    it("should generate the spec", () => {
      const spec = getSpec(PetController, {specType: SpecTypes.OPENAPI});

      expect(spec).toMatchSnapshot();
    });
  });

  describe("AsyncAPI", () => {
    it("should generate the spec", () => {
      const spec = getSpec(PetController, {specType: SpecTypes.ASYNCAPI});

      expect(spec).toMatchSnapshot();
    });
  });
});
