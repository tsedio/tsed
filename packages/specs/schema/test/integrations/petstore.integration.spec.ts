import {Controller} from "@tsed/di";
import {Use} from "@tsed/platform-middlewares";
import {BodyParams, PathParams} from "@tsed/platform-params";
import {CollectionOf, Property} from "@tsed/schema";
import {
  Delete,
  Enum,
  Example,
  Get,
  getSpec,
  Groups,
  Partial,
  Patch,
  Post,
  Put,
  Required,
  Returns,
  SpecTypes,
  Subscribe
} from "../../src/index";

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
class PetController {
  @Use("/")
  middleware(@PathParams("id") id: string) {}

  @Get("/:id")
  @Returns(200, Pet).Description("Returns a pet")
  @Returns(404)
  get(@PathParams("id") id: string) {
    return null;
  }

  @Get("/")
  @Returns(200, Array).Of(Pet).Description("Returns all pets")
  getAll() {
    return [];
  }

  @Patch("/:id")
  @Subscribe("pet.updated")
  @Returns(200, Pet).Description("Returns a pet")
  @Returns(404)
  patch(@PathParams("id") id: string, @BodyParams() @Partial() partial: Pet) {
    return null;
  }

  @Post("/:id")
  @Subscribe("pet.created")
  @Returns(200, Pet).Description("Returns a pet")
  @Returns(404)
  post(@BodyParams() @Groups("update") pet: Pet) {
    return null;
  }

  @Put("/")
  @Subscribe("pet.updated")
  @Returns(201, Pet).Description("Returns a pet")
  @Returns(404)
  put(@BodyParams() @Groups("create") pet: Pet) {
    return null;
  }

  @Delete("/:id")
  @Subscribe("pet.deleted")
  @Returns(204).Description("Returns nothing")
  @Returns(404)
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
});
