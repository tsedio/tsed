import {PlatformTest} from "@tsed/platform-http/testing";
import {expect} from "chai";
import {MyCtrl} from "../controllers/MyCtrl";
import {DbService} from "../services/DbService";

describe("MyCtrl", () => {
  // bootstrap your Server to load all endpoints before run your test
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should do something", async () => {
    const locals = [
      {
        provide: DbService,
        use: {
          getData: () => {
            return "test";
          }
        }
      }
    ];

    // give the locals map to the invoke method
    const instance: MyCtrl = await PlatformTest.invoke(MyCtrl, locals);

    // and test it
    expect(!!instance).to.eq(true);
    expect(instance.getData()).to.equals("test");
  });
});
