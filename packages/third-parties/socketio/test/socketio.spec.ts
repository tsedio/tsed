import {Nsp, SocketService} from "../src/index.js";
import {Controller} from "@tsed/di";
import {Get} from "@tsed/schema";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Server} from "./app/Server.js";
import SuperTest from "supertest";

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
      adapter: PlatformExpress as any,
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
