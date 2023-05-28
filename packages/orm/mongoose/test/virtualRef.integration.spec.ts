import {Controller, Get, Inject, PlatformTest} from "@tsed/common";
import {getValue} from "@tsed/core";
import {serialize} from "@tsed/json-mapper";
import {Model, MongooseModel, ObjectID, VirtualRef, VirtualRefs} from "@tsed/mongoose";
import {PlatformExpress} from "@tsed/platform-express";
import {CollectionOf, getJsonSchema, Groups, Integer, Required} from "@tsed/schema";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import SuperTest from "supertest";
import {Server} from "./helpers/Server";

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
  galaxies?: VirtualRefs<GalaxiesModel>;

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

describe("Mongoose", () => {
  describe("Ref", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;

    beforeEach(
      TestMongooseContext.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [SpacesController]
        }
      })
    );
    beforeEach(async () => {
      const controller = PlatformTest.get<SpacesController>(SpacesController)!;

      const space1 = new controller.spaces({name: "Space1"});
      await space1.save();

      const galaxy1 = new controller.galaxies({name: "galaxy1", spaceId: space1._id});
      await galaxy1.save();
    });
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });

    afterEach(TestMongooseContext.reset);

    it("should return the json-schema of the given model", () => {
      expect(getJsonSchema(SpacesModel)).toMatchSnapshot();
    });

    it("should map the document to POO", async () => {
      const controller = PlatformTest.get<SpacesController>(SpacesController)!;
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
      const {body: list} = await request.get(`/rest/spaces`);

      expect(list).toMatchObject([
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
  });
});
