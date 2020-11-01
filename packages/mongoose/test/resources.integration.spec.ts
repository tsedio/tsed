import {Controller, Get, Inject, Injectable, PathParams, PlatformTest} from "@tsed/common";
import {MongooseModel} from "@tsed/mongoose";
import {PlatformExpress} from "@tsed/platform-express/src";
import {Returns} from "@tsed/schema/src";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {TestUser, TestUserCreation} from "./helpers/models/User";
import {Server} from "./helpers/Server";

@Injectable()
class ResourcesRepository {
  @Inject(TestUser)
  model: MongooseModel<TestUser>;

  create(user: Omit<TestUserCreation, "_id">) {
    const resource = new this.model(user);

    return resource.save();
  }

  findById(id: string) {
    return this.model.findById(id);
  }

  findAll() {
    return this.model.find({});
  }
}

@Controller("/resources")
class ResourcesCtrl {
  @Inject()
  repository: ResourcesRepository;

  @Get("/without/:id")
  getWithoutType(@PathParams("id") id: string) {
    return this.repository.findById(id);
  }

  @Get("/:id")
  @Returns(200, TestUser)
  get(@PathParams("id") id: string) {
    return this.repository.findById(id);
  }

  @Get("/")
  @(Returns(200, Array).Of(TestUser))
  getAll() {
    return this.repository.findAll();
  }
}

describe("Mongoose", () => {
  describe("Test Resource", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    let currentUser: TestUserCreation;
    before(
      TestMongooseContext.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [ResourcesCtrl]
        }
      })
    );
    before(async () => {
      const repository = PlatformTest.get<ResourcesRepository>(ResourcesRepository)!;

      currentUser = await repository.create({email: "email@email.fr", password: "test"});
    });
    before(() => {
      request = SuperTest(PlatformTest.callback());
    });

    after(TestMongooseContext.reset);

    it("should get a user", async () => {
      const {body} = await request.get(`/rest/resources/${currentUser._id}`);

      expect(body).to.deep.eq({
        email: "email@email.fr",
        id: currentUser._id.toString(),
        pre: "hello pre"
      });
    });

    it("should get a user without typing", async () => {
      const {body} = await request.get(`/rest/resources/without/${currentUser._id}`);

      expect(body).to.deep.eq({
        email: "email@email.fr",
        id: currentUser._id.toString(),
        pre: "hello pre"
      });
    });

    it("should get users", async () => {
      const {body} = await request.get(`/rest/resources`);

      expect(body).to.deep.eq([
        {
          email: "email@email.fr",
          id: currentUser._id.toString(),
          pre: "hello pre"
        }
      ]);
    });
  });
});
