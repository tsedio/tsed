import {Constant, Controller} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {Req} from "@tsed/platform-http";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, Session} from "@tsed/platform-params";
import {Allow, Email, Get, Ignore, MinLength, Post, Property, Required, Returns} from "@tsed/schema";
import SuperTest from "supertest";
import {promisify} from "util";
import {afterAll, beforeAll, describe, expect, it} from "vitest";

import {PlatformTestingSdkOpts} from "../interfaces/index.js";

export class UserCreation {
  @Property()
  name: string;

  @Required()
  @Email()
  @Allow(null)
  email: string;

  @Required()
  @MinLength(6)
  @Allow(null)
  password: string;
}

export class User extends UserCreation {
  @Ignore()
  declare password: string;
}

@Controller("/session")
export class SessionCtrl {
  @Constant("PLATFORM_NAME")
  platformName: string;

  @Post("/connect")
  connect(@Session() session: any, @BodyParams() user: UserCreation) {
    session.user = user;

    return Promise.resolve(user);
  }

  @Get("/userinfo")
  @Returns(200, User)
  userInfo(@Session("user") user: User): Promise<User> {
    if (!user) {
      return Promise.reject(new NotFound("User not found"));
    }

    return Promise.resolve(user);
  }

  @Get("/logout")
  @Returns(204)
  logout(@Req() req: any) {
    switch (this.platformName) {
      case "koa":
        return Promise.resolve((req.ctx.session = null));
      case "express":
        delete req.session.user;

        return promisify(req.session.destroy.bind(req.session))();
    }

    return Promise.resolve();
  }
}

export function testSession(options: PlatformTestingSdkOpts) {
  let request: SuperTest.Agent;
  beforeAll(
    PlatformTest.bootstrap(options.server, {
      ...options,
      mount: {
        "/rest": [SessionCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest.agent(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

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

      expect(response.body).toEqual({
        email: "test@test.fr",
        name: "name"
      });

      await request.get("/rest/session/logout").expect(204);
      await request.get("/rest/session/userinfo").expect(404);
    });
  });
}
