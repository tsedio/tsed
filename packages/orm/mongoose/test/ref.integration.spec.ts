import {faker} from "@faker-js/faker";
import {Controller, Inject} from "@tsed/di";
import {deserialize, serialize} from "@tsed/json-mapper";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, QueryParams} from "@tsed/platform-params";
import {Get, Post} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import SuperTest from "supertest";

import {MongooseModel} from "../src/index.js";
import {TestProfile, TestUser} from "./helpers/models/User.js";
import {Server} from "./helpers/Server.js";

@Controller("/profiles")
class ProfilesCtrl {
  @Inject(TestUser)
  private UserModel: MongooseModel<TestUser>;

  @Inject(TestProfile)
  private ProfileModel: MongooseModel<TestProfile>;

  @Post("/user")
  createUser(@BodyParams() body: TestUser) {
    return new this.UserModel(body).save();
  }

  @Post("/")
  createProfile(@BodyParams() body: TestProfile) {
    return new this.ProfileModel(body).save();
  }

  @Get("/")
  getTest(@QueryParams("full") full: boolean) {
    return full ? this.ProfileModel.find().populate("user") : this.ProfileModel.find();
  }
}

const baseUser = {
  email: faker.internet.email(),
  password: faker.internet.password({length: 12})
};

const baseProfile = {
  image: faker.image.avatar(),
  age: faker.number.int(2)
};

async function getServiceFixture() {
  const repository = PlatformTest.get<ProfilesCtrl>(ProfilesCtrl)!;

  const currentUser = await repository.createUser(deserialize<TestUser>(baseUser, {type: TestUser}));
  const currentProfile = await repository.createProfile(
    deserialize<TestProfile>(
      {
        ...baseProfile,
        user: currentUser._id
      },
      {
        type: TestProfile
      }
    )
  );

  const request = SuperTest(PlatformTest.callback());

  return {
    currentUser,
    currentProfile,
    request
  };
}

describe("Mongoose", () => {
  describe("Ref", () => {
    beforeEach(
      TestContainersMongo.bootstrap(Server, {
        adapter: PlatformExpress,
        mount: {
          "/rest": [ProfilesCtrl]
        }
      })
    );

    afterEach(() => TestContainersMongo.reset("testusers"));

    it("should deserialize class with ref", () => {
      const result = deserialize(
        {
          image: "url",
          age: 12,
          user: {
            email: "test@test.com",
            password: "password"
          }
        },
        {type: TestProfile}
      );

      expect(result).toEqual({
        age: 12,
        image: "url",
        user: {
          alwaysIgnored: "hello ignore",
          email: "test@test.com",
          password: "password"
        }
      });
      expect(result.user).toBeInstanceOf(TestUser);
    });

    it("should transform mongoose instance to class", async () => {
      const {currentUser} = await getServiceFixture();

      const result = currentUser.toClass();

      expect(result).toBeInstanceOf(TestUser);
      expect(typeof result._id).toBe("string");
      expect(result.alwaysIgnored).toBe("hello ignore");
      expect(Date.parse(result.created as unknown as string)).not.toBeNaN();
      expect(result.email).toBe(currentUser.email);
      expect(result.password).toBe(currentUser.password);
      expect(result.post).toBe("hello post");
      expect(result.pre).toBe("hello pre");
      expect(Date.parse(result.updated as unknown as string)).not.toBeNaN();
    });

    it("should transform mongoose instance to object", async () => {
      const {currentUser} = await getServiceFixture();

      const result = serialize(currentUser, {type: TestUser, endpoint: true});

      expect(result).toBeInstanceOf(Object);
      expect(typeof result.id).toBe("string");
      expect(result.alwaysIgnored).toBeUndefined();
      expect(Date.parse(result.created)).not.toBeNaN();
      expect(result.email).toBe(currentUser.email);
      expect(result.password).toBe(currentUser.password);
      expect(result.post).toBe("hello post");
      expect(result.pre).toBe("hello pre");
      expect(typeof result.updated).toBe("string");
    });

    it("GET /profiles full=true", async () => {
      const {request} = await getServiceFixture();

      const {body: list} = await request.get(`/rest/profiles?full=true`);

      expect(list).toEqual([
        {
          id: list[0].id,
          age: baseProfile.age,
          image: baseProfile.image,
          created: list[0].created,
          updated: list[0].updated,
          user: {
            id: list[0].user.id,
            email: baseUser.email,
            password: baseUser.password,
            pre: "hello pre",
            created: list[0].user.created,
            updated: list[0].user.updated
          }
        }
      ]);
    });

    it("GET /profiles full=false", async () => {
      const {request} = await getServiceFixture();

      const {body: list} = await request.get(`/rest/profiles?full=false`);

      expect(list).toEqual([
        {
          id: String(list[0].id),
          created: String(list[0].created),
          updated: String(list[0].updated),
          age: baseProfile.age,
          image: baseProfile.image,
          user: String(list[0].user)
        }
      ]);
    });
  });
});
