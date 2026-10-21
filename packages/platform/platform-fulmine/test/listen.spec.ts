import {Controller} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {Get} from "@tsed/schema";
import fulmine from "fulmine.js";

import {PlatformFulmine} from "../src/components/PlatformFulmine.js";

@Controller("/hello")
class HelloController {
  @Get("/")
  get() {
    return {hello: "world"};
  }
}

class Server {}

// The SDK suites go through supertest, which wraps the app in the http.createServer() of node. These
// tests listen the way an application does, on uWebSockets.js.
describe("PlatformFulmine listening on uWebSockets.js", () => {
  afterEach(() => PlatformTest.reset());

  it("should answer on the port bound by app.listen()", async () => {
    const platform = await PlatformFulmine.bootstrap(Server, {
      httpPort: "127.0.0.1:0",
      httpsPort: false,
      logger: {level: "off"},
      mount: {"/rest": [HelloController]}
    });
    await platform.listen();

    const response = await fetch(`http://${platform.settings.get("httpPort")}/rest/hello`);

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual({hello: "world"});
    expect(platform.app.getApp().uwsApp).toBeDefined();

    await platform.stop();
  });

  it("should listen with the fulmine app given in the settings", async () => {
    const app = fulmine();
    const platform = await PlatformFulmine.bootstrap(Server, {
      httpPort: "127.0.0.1:0",
      httpsPort: false,
      logger: {level: "off"},
      fulmine: {app},
      mount: {"/rest": [HelloController]}
    });
    await platform.listen();

    expect(platform.app.getApp()).toBe(app);
    expect((await fetch(`http://${platform.settings.get("httpPort")}/rest/hello`)).status).toEqual(200);

    await platform.stop();
  });

  it("should refuse httpsPort, TLS is set on the fulmine app", () => {
    expect(() =>
      PlatformFulmine.bootstrap(Server, {
        httpPort: false,
        httpsPort: "127.0.0.1:0",
        logger: {level: "off"}
      })
    ).toThrow("PlatformFulmine: set TLS on the fulmine app");
  });
});
