import {Controller, Get, PlatformTest} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Nsp, SocketService} from "@tsed/socketio";
import {expect} from "chai";
import SuperTest from "supertest";
import {Server} from "./app/Server";

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
  let request: SuperTest.SuperTest<SuperTest.Test>;

  before(
    PlatformTest.bootstrap(Server, {
      platform: PlatformExpress,
      mount: {
        "/rest": [HelloCtrl]
      }
    })
  );
  before(() => (request = SuperTest(PlatformTest.callback())));
  after(PlatformTest.reset);

  it("should render index page", async () => {
    const response = await request.get("/socket").expect(200);

    expect(response.text).to.contains("/socket/socket.io.js");
  });
});
