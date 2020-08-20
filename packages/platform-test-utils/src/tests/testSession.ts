import {
  Allow,
  BodyParams,
  Controller,
  Email,
  Get,
  Ignore,
  MinLength,
  PlatformTest,
  Post,
  Property,
  Required,
  Returns,
  Session,
  Status
} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Indexed, Unique} from "@tsed/mongoose";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {PlatformTestOptions} from "../interfaces";

export class UserCreation {
  @Property()
  name: string;

  @Indexed()
  @Required()
  @Email()
  @Unique()
  @Allow(null)
  email: string;

  @Required()
  @MinLength(6)
  @Allow(null)
  password: string;
}

export class User extends UserCreation {
  @Ignore()
  password: string;
}

@Controller("/session")
export class SessionCtrl {
  @Post("/connect")
  async connect(@Session() session: any, @BodyParams() user: UserCreation) {
    session.user = user;

    return user;
  }

  @Get("/userinfo")
  @Returns(200, User)
  async userInfo(@Session("user") user: User): Promise<User> {
    if (!user) {
      throw new NotFound("User not found");
    }

    return user;
  }

  @Get("/logout")
  @Status(204)
  async logout(@Session() session: Express.Session) {
    delete session.user;

    return new Promise((resolve, reject) => {
      session.destroy(err => (err ? reject(err) : resolve()));
    });
  }
}

export function testSession(options: PlatformTestOptions) {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [SessionCtrl]
      }
    })
  );
  before(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  describe("Scenario1: POST /rest/session/connected", () => {
    it("should keep connected user in session and destroy session", async () => {
      await request
        .get("/rest/session/userinfo")
        .expect("set-cookie", /connect.sid/)
        .expect(404);

      await request.post("/rest/session/connect").send({
        name: "name",
        email: "test@test.fr",
        password: "password1234"
      });

      // @ts-ignore
      const response = await request.get("/rest/session/userinfo").expect(200);

      expect(response.body).to.deep.eq({
        email: "test@test.fr",
        name: "name"
      });

      await request.get("/rest/session/logout").expect(204);
      await request.get("/rest/session/userinfo").expect(404);
    });
  });
}
