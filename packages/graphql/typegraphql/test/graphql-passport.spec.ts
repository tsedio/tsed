import {PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import "@tsed/platform-express";
import {expect} from "chai";
import SuperTest from "supertest";
import {Server} from "./app/Server";

describe("GraphQL", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  before(
    PlatformTest.bootstrap(Server, {
      platform: PlatformExpress
    })
  );
  before(() => {
    request = SuperTest(PlatformTest.callback());
  });
  after(PlatformTest.reset);

  it("should try login", async () => {
    const response = await request
      .post("/api/graphql")
      .send({
        operationName: null,
        variables: {},
        query: 'mutation {\n  login(email: "test@test.com", password: "test@test.com") {\n    email\n    password\n  }\n}\n'
      })
      .expect(200);

    expect(response.body).to.deep.eq({
      data: {
        login: {
          email: "test@test.com",
          password: "test@test.com"
        }
      }
    });
  });

  it("should throw error", async () => {
    const response = await request
      .post("/api/graphql")
      .send({
        operationName: null,
        variables: {},
        query: 'mutation {\n  login(email: "test@test2.com", password: "test@test.com") {\n    email\n    password\n  }\n}\n'
      })
      .expect(200);

    expect(response.body).to.deep.eq({
      data: null,
      errors: [
        {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            exception: {
              headers: {},
              name: "UNAUTHORIZED",
              status: 401,
              type: "HTTP_EXCEPTION"
            }
          },
          locations: [
            {
              column: 3,
              line: 2
            }
          ],
          message: "Wrong credentials",
          path: ["login"]
        }
      ]
    });
  });
});
