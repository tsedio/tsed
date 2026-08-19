import {Configuration, Controller, destroyInjector} from "@tsed/di";
import {Get} from "@tsed/schema";
import {PathParams} from "@tsed/platform-params";
import {PlatformCustom} from "../builder/__fixtures__/PlatformCustom.js";

@Controller("/widgets")
class FetchController {
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
});
