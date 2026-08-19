import {Configuration, Controller, destroyInjector} from "@tsed/di";
import {Get, Post} from "@tsed/schema";
import {BodyParams, PathParams} from "@tsed/platform-params";
import {PlatformCustom} from "../builder/__fixtures__/PlatformCustom.js";

@Controller("/widgets")
class FetchController {
  @Post("/")
  create(@BodyParams() body: {name: string}) {
    return body;
  }

  @Get("/error")
  error() {
    throw new Error("fetch failure");
  }

  @Get("/:id")
  get(@PathParams("id") id: string) {
    return {id};
  }
}

@Configuration({logger: {level: "off"}, mount: {"/api": [FetchController]}})
class FetchServer {}

describe("PlatformApplication.fetchHandler", () => {
  beforeEach(() => destroyInjector());
  afterEach(() => destroyInjector());

  it("executes a decorated controller without a native adapter request", async () => {
    const platform = await PlatformCustom.bootstrap(FetchServer, {httpPort: false, httpsPort: false});

    const response = await platform.app.fetchHandler()(new Request("https://tsed.dev/api/widgets/42"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({id: "42"});
  });

  it("converts a decorated controller error to a Fetch response", async () => {
    const platform = await PlatformCustom.bootstrap(FetchServer, {httpPort: false, httpsPort: false});

    const response = await platform.app.fetchHandler()(new Request("https://tsed.dev/api/widgets/error"));

    expect(response.status).toBe(500);
  });

  it("binds a JSON Fetch body through BodyParams", async () => {
    const platform = await PlatformCustom.bootstrap(FetchServer, {httpPort: false, httpsPort: false});

    const response = await platform.app.fetchHandler()(
      new Request("https://tsed.dev/api/widgets", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({name: "Ts.ED"})
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({name: "Ts.ED"});
  });

  it("converts an invalid JSON body to a Fetch error response", async () => {
    const platform = await PlatformCustom.bootstrap(FetchServer, {httpPort: false, httpsPort: false});

    const response = await platform.app.fetchHandler()(
      new Request("https://tsed.dev/api/widgets", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: "{"
      })
    );

    expect(response.status).toBe(500);
  });
});
