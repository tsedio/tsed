import faker from "@faker-js/faker";
import {BodyParams, Controller, Get, Inject, PlatformTest, Post, QueryParams} from "@tsed/common";
import {deserialize, serialize} from "@tsed/json-mapper";
import {MongooseModel} from "@tsed/mongoose";
import {PlatformExpress} from "@tsed/platform-express";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import SuperTest from "supertest";
import {TestProfile2, TestUser} from "./helpers/models/User";
import {Server} from "./helpers/Server";

@Controller("/profiles")
class ProfilesCtrl {
  @Inject(TestUser)
  private UserModel: MongooseModel<TestUser>;

  @Inject(TestProfile2)
  private ProfileModel2: MongooseModel<TestProfile2>;

  @Post("/user")
  createUser(@BodyParams() body: TestUser) {
    return new this.UserModel(body).save();
  }

  @Post("/")
  createProfile(@BodyParams() body: TestProfile2) {
    return new this.ProfileModel2(body).save();
  }

  @Get("/")
  getTest(@QueryParams("full") full: boolean) {
    return full ? this.ProfileModel2.find().populate("users") : this.ProfileModel2.find();
  }
}

const baseUser = {
  email: faker.internet.email(),
  password: faker.internet.password(12)
};

const baseProfile = {
  image: faker.image.avatar(),
  age: faker.datatype.number(2)
};

describe("Mongoose", () => {
  describe("Ref", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    let currentUser: any;
    let currentProfile: any;
    beforeEach(
      TestMongooseContext.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [ProfilesCtrl]
        }
      })
    );
    beforeEach(async () => {
      const repository = PlatformTest.get<ProfilesCtrl>(ProfilesCtrl)!;

      currentUser = await repository.createUser(deserialize<TestUser>(baseUser, {type: TestUser}));

      currentProfile = await repository.createProfile(
        deserialize<TestProfile2>(
          {
            ...baseProfile,
            users: [currentUser._id]
          },
          {
            type: TestProfile2
          }
        )
      );
    });
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });

    afterEach(TestMongooseContext.reset);

    it("should deserialize class with ref", () => {
      const result = deserialize(
        {
          image: "url",
          age: 12,
          users: [
            {
              email: "test@test.com",
              password: "password"
            }
          ]
        },
        {type: TestProfile2}
      );

      expect(result).toEqual({
        age: 12,
        image: "url",
        users: [
          {
            alwaysIgnored: "hello ignore",
            email: "test@test.com",
            password: "password"
          }
        ]
      });
      expect(result.users[0]).toBeInstanceOf(TestUser);
    });

    it("should transform mongoose instance to class", () => {
      const result = currentUser.toClass();

      expect(result).toBeInstanceOf(TestUser);
      expect(typeof result._id).toBe("string");
      expect(result.alwaysIgnored).toBe("hello ignore");
      expect(Date.parse(result.created)).not.toBeNaN();
      expect(result.email).toBe(currentUser.email);
      expect(result.password).toBe(currentUser.password);
      expect(result.post).toBe("hello post");
      expect(result.pre).toBe("hello pre");
      expect(Date.parse(result.updated)).not.toBeNaN();
    });

    it("should transform mongoose instance to object", () => {
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
      const {body: list} = await request.get(`/rest/profiles?full=true`);

      expect(list).toEqual([
        {
          id: list[0].id,
          age: baseProfile.age,
          image: baseProfile.image,
          created: list[0].created,
          updated: list[0].updated,
          users: [
            {
              id: list[0].users[0].id,
              email: baseUser.email,
              password: baseUser.password,
              pre: "hello pre",
              created: list[0].users[0].created,
              updated: list[0].users[0].updated
            }
          ]
        }
      ]);
    });

    it("GET /profiles full=false", async () => {
      const {body: list} = await request.get(`/rest/profiles?full=false`);

      expect(list).toEqual([
        {
          id: String(list[0].id),
          created: String(list[0].created),
          updated: String(list[0].updated),
          age: baseProfile.age,
          image: baseProfile.image,
          users: [String(list[0].users[0])]
        }
      ]);
    });
  });
});
