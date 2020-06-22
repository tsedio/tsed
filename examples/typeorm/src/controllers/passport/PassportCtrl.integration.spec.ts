import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {bootstrapServer} from "../../../test/helpers/bootstrapServer";
import {User} from "../../entities/User";
import {UserRepository} from "../../repositories/UserRepository";
import {PassportCtrl} from "./PassportCtrl";

describe("PassportCtrl", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(bootstrapServer({
    mount: {
      "/rest": [PassportCtrl]
    }
  }));

  before(() => {
    request = SuperTest(PlatformTest.callback());

    // create initial user
    const usersRepository = PlatformTest.get<UserRepository>(UserRepository);
    const user = new User();
    user.id = 1;
    user.password = "password";
    user.email = "admin@tsed.io";
    user.firstName = "John";
    user.lastName = "Doe";
    user.age = 18;

    console.log(usersRepository)

    return usersRepository.save(user);
  });
  after(PlatformTest.reset);

  describe("POST /rest/auth/login", () => {
    it("should return a user", async () => {
      const response = await request.post("/rest/auth/login").send({
        email: "admin@tsed.io",
        password: "password"
      })
        .expect(200);

      expect(response.body).to.deep.eq({
        "age": 18,
        "email": "admin@tsed.io",
        "firstName": "John",
        "id": 1,
        "lastName": "Doe"
      });
    });

    it("should throw an error if user doesn\'t exists", async () => {
      const response = await request.post("/rest/auth/login").send({
        email: "admin2@tsed.io",
        password: "password"
      })
        .expect(401);

      expect(response.text).to.deep.eq("Unauthorized");
    });

    it("should throw an error if the password is missing", async () => {
      const response = await request.post("/rest/auth/login").send({
        email: "admin2@tsed.io"
      })
        .expect(400);

      expect(response.text).to.deep.eq("Bad Request");
    });

    it("should throw an error if the email is missing", async () => {
      const response = await request.post("/rest/auth/login").send({})
        .expect(400);

      expect(response.text).to.deep.eq("Bad Request");
    });
  });
});
