import {Controller, importProviders, Module} from "@tsed/common";
import {expect} from "chai";

@Controller("/test")
class TestCtrl {}

@Controller("/test2")
class Test2Ctrl {}

@Module({
  mount: {
    "/heath": [Test2Ctrl]
  }
})
class HealthModule {}

describe("importProviders", () => {
  it("should load providers and merge configuration", async () => {
    const result = await importProviders(
      {
        mount: {
          "/rest": [TestCtrl]
        },
        imports: [HealthModule]
      },
      ["imports", "mount"]
    );

    expect(result).to.deep.eq([
      {
        route: "/heath",
        token: Test2Ctrl
      },
      {
        route: undefined,
        token: HealthModule
      },
      {
        route: "/rest",
        token: TestCtrl
      }
    ]);
  });
});
