import {Controller} from "@tsed/di";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Get} from "@tsed/schema";
import SuperTest from "supertest";

import {Nsp, SocketService} from "../src/index.js";
import {Server} from "./app/Server.js";

@SocketService("/my-namespace")
export class HelloSocketService {
  @Nsp nsp: Nsp;

  helloAll() {
    this.nsp.emit("hi", "everyone!");
  }
}

@Controller("/nsp")
export class HelloCtrl {
  constructor(private service: HelloSocketService) {}

  @Get("/hello")
  hello() {
    this.service.helloAll();

    return "is sent";
  }
}

describe("SocketIO", () => {
  let request: SuperTest.Agent;

  beforeAll(
    PlatformTest.bootstrap(Server, {
      platform: PlatformExpress,
      mount: {
        "/rest": [HelloCtrl]
      }
    })
  );
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  it("should render index page", async () => {
    const response = await request.get("/socket").expect(200);

    expect(response.text).toContain("/socket/socket.io.js");
  });
});
