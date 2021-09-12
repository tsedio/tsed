import {BodyParams, Constant, Controller, Get, PlatformTest, Post, Req, Session} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Indexed, Unique} from "@tsed/mongoose";
import {Allow, Email, Ignore, MinLength, Property, Required, Returns} from "@tsed/schema";
import {expect} from "chai";
import SuperTest from "supertest";
import {promisify} from "util";
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
  @Constant("PLATFORM_NAME")
  platformName: string;

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
  @Returns(204)
  async logout(@Req() req: any) {
    switch (this.platformName) {
      case "koa":
        return (req.ctx.session = null);
      case "express":
        delete req.session.user;

        return promisify(req.session.destroy.bind(req.session))();
    }
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
      await request.get("/rest/session/userinfo").expect(404);

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
