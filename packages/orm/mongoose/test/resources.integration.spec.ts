import {faker} from "@faker-js/faker";
import {isArray} from "@tsed/core";
import {Controller, Inject, Injectable} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, PathParams} from "@tsed/platform-params";
import {Get, Groups, Post, Returns} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import SuperTest from "supertest";

import {MongooseModel} from "../src/index.js";
import {TestRole, TestUser, TestUserNew} from "./helpers/models/User.js";
import {Server} from "./helpers/Server.js";

@Injectable()
class ResourcesRepository {
  @Inject(TestUser)
  model: MongooseModel<TestUser>;

  create(user: Partial<TestUser>) {
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

  @Inject(TestUserNew)
  TestUserNew: MongooseModel<TestUserNew>;

  @Inject(TestRole)
  TestRole: MongooseModel<TestRole>;

  @Get("/without/:id")
  @(Returns(200, TestUser).Groups("!creation"))
  getWithoutType(@PathParams("id") id: string) {
    return this.repository.findById(id);
  }

  @Get("/:id")
  @(Returns(200, TestUser).Groups("!creation"))
  get(@PathParams("id") id: string) {
    return this.repository.findById(id);
  }

  @Get("/")
  @(Returns(200, Array).Of(TestUser).Groups("!creation"))
  getAll() {
    return this.repository.findAll();
  }

  @Post("/")
  @(Returns(201, TestUser).Groups("!creation"))
  create(@BodyParams() @Groups("creation") user: TestUser) {
    return this.repository.create(user);
  }

  @Post("/scenario-1")
  async createWithoutReturnedType() {
    const role = new this.TestRole(new TestRole());
    const user = new this.TestUserNew(new TestUserNew());

    role.name = faker.hacker.verb();

    await role.save();

    user.name = faker.person.firstName();

    user.roles = [role._id];

    await user.save();

    return {
      id: user._id,
      roles: user.roles
    }; // Isn't necessary to map the model.
  }
}

async function getServiceFixture() {
  const repository = PlatformTest.get<ResourcesRepository>(ResourcesRepository)!;

  const baseUser = {
    email: faker.internet.email(),
    password: faker.internet.password({length: 12})
  };

  const baseUser2 = {
    email: faker.internet.email(),
    password: faker.internet.password({length: 12})
  };

  const currentUser2 = await repository.create(baseUser2);

  const dataScope = new Map();
  dataScope.set("scope1", currentUser2._id);

  const currentUser = await repository.create({
    ...baseUser,
    dataScope
  });

  const request = SuperTest(PlatformTest.callback());

  return {currentUser, currentUser2, baseUser, baseUser2, request};
}

describe("Mongoose", () => {
  beforeEach(
    TestContainersMongo.bootstrap(Server, {
      adapter: PlatformExpress,
      mount: {
        "/rest": [ResourcesCtrl]
      }
    })
  );
  afterEach(() => TestContainersMongo.reset("testusers"));

  describe("Resources", () => {
    it("should return an array of roles", async () => {
      const {request} = await getServiceFixture();

      const {body} = await request.post("/rest/resources/scenario-1");

      expect(isArray(body.roles)).toBe(true);
    });

    it("should get a user without typing", async () => {
      const {request, baseUser, currentUser} = await getServiceFixture();

      const {body} = await request.get(`/rest/resources/without/${currentUser._id}`);

      expect(body).toEqual({
        email: baseUser.email,
        id: currentUser._id.toString(),
        pre: "hello pre",
        created: String(body.created),
        updated: String(body.updated)
      });
    });

    it("should get a user", async () => {
      const {request, baseUser, currentUser} = await getServiceFixture();

      const {body} = await request.get(`/rest/resources/${currentUser._id}`);

      expect(body).toEqual({
        email: baseUser.email,
        id: currentUser._id.toString(),
        pre: "hello pre",
        created: String(body.created),
        updated: String(body.updated)
      });
    });

    it("should get users", async () => {
      const {request, baseUser, currentUser, baseUser2, currentUser2} = await getServiceFixture();
      const {body} = await request.get(`/rest/resources`);

      expect(body).toEqual([
        {
          email: baseUser2.email,
          id: currentUser2._id.toString(),
          pre: "hello pre",
          created: String(body[0].created),
          updated: String(body[0].updated)
        },
        {
          email: baseUser.email,
          id: currentUser._id.toString(),
          pre: "hello pre",
          created: String(body[1].created),
          updated: String(body[1].updated)
        }
      ]);
    });

    it("should create a user", async () => {
      const {request} = await getServiceFixture();
      const user = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        current: {
          roles: [1, 2, 3]
        },
        data: {
          ISM: {
            roles: [1, 2, 3]
          }
        }
      };

      expect(
        deserialize(user, {
          type: TestUser
        })
      ).toEqual({
        email: user.email,
        password: user.password,
        current: {
          roles: [1, 2, 3]
        },
        data: new Map([
          [
            "ISM",
            {
              roles: [1, 2, 3]
            }
          ]
        ]),
        alwaysIgnored: "hello ignore"
      });

      const {body} = await request.post(`/rest/resources`).send(user).expect(201);

      expect(body).toEqual({
        current: {
          roles: [1, 2, 3]
        },
        data: {
          ISM: {
            roles: [1, 2, 3]
          }
        },
        email: user.email,
        id: body.id,
        post: "hello post",
        pre: "hello pre",
        created: String(body.created),
        updated: String(body.updated)
      });
    });
  });
});
