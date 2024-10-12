import {getValue} from "@tsed/core";
import {Controller, Inject} from "@tsed/di";
import {serialize} from "@tsed/json-mapper";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {CollectionOf, Get, getJsonSchema, Groups, Integer, Required} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import SuperTest from "supertest";

import {Model, MongooseModel, ObjectID, VirtualRef} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@Model()
export class GalaxiesModel {
  @ObjectID("id")
  @Groups("!internal")
  _id?: string;

  @Required()
  name: string;

  @Groups("!internal")
  spaceId?: string;
}

@Model()
export class SpacesModel {
  @ObjectID("id")
  _id?: string;

  @Required()
  name: string;

  @VirtualRef({
    ref: GalaxiesModel,
    localField: "_id",
    foreignField: "spaceId",
    justOne: false
  })
  @CollectionOf(GalaxiesModel)
  galaxies?: GalaxiesModel[];

  @VirtualRef({
    ref: GalaxiesModel,
    localField: "_id",
    foreignField: "spaceId",
    count: true
  })
  @Groups("!internal")
  @Integer()
  galaxyCount?: number;
}

@Controller("/spaces")
class SpacesController {
  @Inject(SpacesModel)
  spaces: MongooseModel<SpacesModel>;

  @Inject(GalaxiesModel)
  galaxies: MongooseModel<GalaxiesModel>;

  @Get("/")
  getSpaces() {
    return this.spaces.find({}, {}, {populate: ["galaxies", "galaxyCount"]});
  }
}

export async function getServiceFixture() {
  const controller = PlatformTest.get<SpacesController>(SpacesController)!;

  const space1 = new controller.spaces({name: "Space1"});
  await space1.save();

  const galaxy1 = new controller.galaxies({name: "galaxy1", spaceId: space1._id});
  await galaxy1.save();

  const request = SuperTest(PlatformTest.callback());

  return {
    space1,
    galaxy1,
    controller,
    request
  };
}

describe("Mongoose", () => {
  describe("VirtualRef", () => {
    beforeEach(
      TestContainersMongo.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [SpacesController]
        }
      })
    );
    afterEach(() => TestContainersMongo.reset());

    it("should return the json-schema of the given model", () => {
      expect(getJsonSchema(SpacesModel)).toMatchSnapshot();
    });
    it("should map the document to POO", async () => {
      const {controller} = await getServiceFixture();
      const result = await controller.getSpaces();

      expect(getValue(result, "0.galaxies.0.name")).toEqual("galaxy1");
      expect(serialize(result, {virtuals: ["galaxies", "galaxyCount"]})).toMatchObject([
        {
          name: "Space1",
          galaxyCount: 1,
          galaxies: [
            {
              name: "galaxy1"
            }
          ]
        }
      ]);
    });
    it("GET /spaces", async () => {
      const {request} = await getServiceFixture();
      const {body: list} = await request.get(`/rest/spaces`);

      expect(list[0]).toMatchObject({
        id: expect.any(String),
        name: "Space1",
        galaxyCount: 1,
        galaxies: [
          {
            id: expect.any(String),
            name: "galaxy1",
            spaceId: expect.any(String)
          }
        ]
      });
    });
  });
});
