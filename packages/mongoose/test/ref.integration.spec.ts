import {BodyParams, Controller, Get, Inject, PlatformTest, Post, QueryParams} from "@tsed/common";
import {deserialize} from "@tsed/json-mapper";
import {MongooseModel} from "@tsed/mongoose";
import {PlatformExpress} from "@tsed/platform-express/src";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {expect} from "chai";
import faker from "faker";
import SuperTest from "supertest";
import {TestProfile, TestUser} from "./helpers/models/User";
import {Server} from "./helpers/Server";

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
  async getTest(@QueryParams("full") full: boolean) {
    return full ? await this.ProfileModel.find().populate("user") : await this.ProfileModel.find();
  }
}

const baseUser = {
  email: faker.internet.email(),
  password: faker.internet.password(12)
};

const baseProfile = {
  image: faker.image.avatar(),
  age: faker.random.number(2)
};

describe("Mongoose", () => {
  describe("Ref", () => {
    let request: SuperTest.SuperTest<SuperTest.Test>;
    let currentUser: TestUser;
    let currentProfile: TestProfile;
    before(
      TestMongooseContext.bootstrap(Server, {
        platform: PlatformExpress,
        mount: {
          "/rest": [ProfilesCtrl]
        }
      })
    );
    before(async () => {
      const repository = PlatformTest.get<ProfilesCtrl>(ProfilesCtrl)!;

      currentUser = await repository.createUser(deserialize<TestUser>(baseUser, {type: TestUser}));
      currentProfile = await repository.createProfile(deserialize<TestProfile>({
        ...baseProfile,
        user: currentUser._id
      }, {
        type: TestProfile
      }));
    });
    before(() => {
      request = SuperTest(PlatformTest.callback());
    });

    after(TestMongooseContext.reset);

    it("GET /profiles", async () => {
      const {body: list1} = await request.get(`/rest/profiles?full=true`);
      // const {body: list2} = await request.get(`/rest/profiles?full=false`);

      expect(list1).to.deep.eq([
        {
          "age": baseProfile.age,
          "image": baseProfile.image,
          "user": {
            "email": baseUser.email,
            "password": baseUser.password,
            "pre": "hello pre"
          }
        }
      ]);
      // expect(list2).to.deep.eq([]);
    });
  });
});
