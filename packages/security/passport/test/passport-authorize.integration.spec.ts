import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {PlatformTestSdk} from "@tsed/platform-test-sdk";
import SuperTest from "supertest";

import {Server, rootDir} from "./app/Server.js";
import {VALID_TOKEN} from "./app/protocols/JwtProtocol.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformExpress as any,
  server: Server
});

const credentials = {email: "admin@tsed.dev", password: "admin@tsed.dev"};
const basic = (email: string, password: string) => `Basic ${Buffer.from(`${email}:${password}`).toString("base64")}`;

describe("@Authorize() route protection", () => {
  let agent: SuperTest.Agent;

  beforeEach(utils.bootstrap({}));
  beforeEach(() => {
    agent = SuperTest.agent(PlatformTest.callback());
  });
  afterEach(() => PlatformTest.reset());

  describe("without session", () => {
    it("rejects @Authorize() without credentials", async () => {
      await agent.get("/guarded/any").expect(401);
    });

    it("accepts @Authorize('basic') with valid credentials", async () => {
      const {body} = await agent.get("/guarded/basic").set("Authorization", basic(credentials.email, credentials.password)).expect(200);

      expect(body).toEqual({account: "admin@tsed.dev"});
    });

    it("rejects @Authorize('basic') with invalid credentials", async () => {
      await agent.get("/guarded/basic").set("Authorization", basic(credentials.email, "wrong")).expect(401);
    });

    it("accepts @Authorize('jwt') with a valid token", async () => {
      const {body} = await agent.get("/guarded/jwt").set("Authorization", `Bearer ${VALID_TOKEN}`).expect(200);

      expect(body).toEqual({account: "admin@tsed.dev"});
    });

    it("rejects @Authorize('jwt') with an invalid token", async () => {
      await agent.get("/guarded/jwt").set("Authorization", "Bearer wrong").expect(401);
    });

    it("does not run a login-only protocol on a guarded route", async () => {
      await agent.post("/guarded/login").send(credentials).expect(401);
    });

    it("rejects @Authorize('session')", async () => {
      await agent.get("/guarded/session").expect(401);
    });

    it("falls back to the jwt strategy for @Authorize(['session', 'jwt'])", async () => {
      await agent.get("/guarded/session-or-jwt").expect(401);

      const {body} = await agent.get("/guarded/session-or-jwt").set("Authorization", `Bearer ${VALID_TOKEN}`).expect(200);

      expect(body).toEqual({account: "admin@tsed.dev"});
    });
  });

  describe("with a session established by the login protocol", () => {
    beforeEach(async () => {
      await agent.post("/auth/login").send(credentials).expect(200);
    });

    it("accepts the session for @Authorize()", async () => {
      const {body} = await agent.get("/guarded/any").expect(200);

      expect(body).toEqual({user: "admin@tsed.dev"});
    });

    it("accepts the session for the protocol that established it", async () => {
      const {body} = await agent.post("/guarded/login").send({}).expect(200);

      expect(body).toEqual({user: "admin@tsed.dev"});
    });

    it("accepts the session for @Authorize('session') and @Authorize(['session', 'jwt'])", async () => {
      await agent.get("/guarded/session").expect(200);
      await agent.get("/guarded/session-or-jwt").expect(200);
    });

    it("still requires basic credentials for @Authorize('basic')", async () => {
      await agent.get("/guarded/basic").expect(401);
      await agent.get("/guarded/basic").set("Authorization", basic(credentials.email, "wrong")).expect(401);
      await agent.get("/guarded/basic").set("Authorization", basic(credentials.email, credentials.password)).expect(200);
    });

    it("still requires a token for @Authorize('jwt')", async () => {
      await agent.get("/guarded/jwt").expect(401);
      await agent.get("/guarded/jwt").set("Authorization", `Bearer ${VALID_TOKEN}`).expect(200);
    });
  });

  describe("with a new login keeping the previous session info", () => {
    it("records the protocol of the new login", async () => {
      await agent.post("/auth/login").send(credentials).expect(200);
      await agent.post("/auth/basic-login").set("Authorization", basic(credentials.email, credentials.password)).expect(200);

      await agent.get("/guarded/basic").expect(200);
      await agent.post("/guarded/login").send({}).expect(401);
    });
  });

  describe("with a session established by a login ending with a redirect", () => {
    it("accepts the session for the protocol that established it", async () => {
      await agent.post("/auth/login-redirect").send(credentials).expect(302).expect("Location", "/guarded/any");

      const {body} = await agent.post("/guarded/login").send({}).expect(200);

      expect(body).toEqual({user: "admin@tsed.dev"});
    });
  });
});
