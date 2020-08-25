import {PlatformTest} from "@tsed/common";
import "@tsed/platform-express";
import {expect} from "chai";
import * as SuperTest from "supertest";
import {Server} from "./app/Server";

describe("SocketIO", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(PlatformTest.bootstrap(Server));
  before(() => (request = SuperTest(PlatformTest.callback())));
  after(PlatformTest.reset);

  it("should render index page", async () => {
    const response = await request.get("/socket").expect(200);

    expect(response.text).to.contains("/socket/socket.io.js");
  });
});
