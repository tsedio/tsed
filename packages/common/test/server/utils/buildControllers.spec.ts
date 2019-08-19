import {InjectorService} from "../../../../di/src";
import {Controller} from "../../../src/mvc/decorators";
import {buildControllers} from "../../../src/server/utils/buildControllers";

describe("buildControllers", () => {
  it("should build all given controller", () => {

    // GIVEN
    @Controller("/")
    class TestCtrl {

    }

    const injector = new InjectorService();
    injector.add(TestCtrl);

    // WHEN
    const result = buildControllers(injector);

    // THEN
    result.length.should.eq(1);
  });
});
