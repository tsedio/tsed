import {PlatformTest} from "@tsed/common";
import {MyCtrl} from "../controllers/MyCtrl";
import {DbService} from "../services/DbService";

describe("MyCtrl", () => {
  // bootstrap your Server to load all endpoints before run your test
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should do something", async () => {
    const locals = [
      {
        token: DbService,
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
    expect(!!instance).toEqual(true);
    expect(instance.getData()).toEqual("test");
  });
});
