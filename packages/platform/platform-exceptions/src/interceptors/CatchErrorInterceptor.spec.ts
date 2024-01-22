import {PlatformTest, runInContext} from "@tsed/common";
import {DIContext, Injectable} from "@tsed/di";
import {CatchErrorMethods} from "../interfaces/CatchErrorMethods";
import {CatchErrorInterceptor} from "./CatchErrorInterceptor";

@Injectable()
class CustomCatchError implements CatchErrorMethods {
  catch(error: any) {
    return "catch";
  }
}

@Injectable()
class Custom2CatchError implements CatchErrorMethods {
  catch(error: any) {
    return "catch";
  }
  finally($ctx: DIContext) {
    $ctx.set("finally", "finally");
  }
}

describe("CatchErrorInterceptor", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("intercept()", () => {
    it("should intercept do nothing if there is no error", async () => {
      // GIVEN
      const ctx = PlatformTest.createRequestContext();
      const interceptor = await PlatformTest.invoke<CatchErrorInterceptor>(CatchErrorInterceptor, []);
      const next: any = () => Promise.resolve("response");

      // WHEN
      const result = await runInContext(ctx, () =>
        interceptor.intercept(
          {
            options: {
              catcher: CustomCatchError
            },
            target: undefined,
            propertyKey: "",
            args: [],
            next: undefined
          },
          next
        )
      );

      // THEN
      return expect(result).toEqual("response");
    });
    it("should intercept error", async () => {
      // GIVEN
      const ctx = PlatformTest.createRequestContext();
      const interceptor = await PlatformTest.invoke<CatchErrorInterceptor>(CatchErrorInterceptor, []);
      const next: any = () => Promise.reject("error");

      // WHEN
      const result = await runInContext(ctx, () =>
        interceptor.intercept(
          {
            options: {
              catcher: CustomCatchError
            },
            target: undefined,
            propertyKey: "",
            args: [],
            next: undefined
          },
          next
        )
      );

      // THEN
      return expect(result).toEqual("catch");
    });
    it("should intercept error and call finally", async () => {
      // GIVEN
      const ctx = PlatformTest.createRequestContext();
      const interceptor = await PlatformTest.invoke<CatchErrorInterceptor>(CatchErrorInterceptor, []);
      const next: any = () => Promise.reject("error");

      // WHEN
      const result = await runInContext(ctx, () =>
        interceptor.intercept(
          {
            options: {
              catcher: Custom2CatchError
            },
            target: undefined,
            propertyKey: "",
            args: [],
            next: undefined
          },
          next
        )
      );

      // THEN
      expect(result).toEqual("catch");
      expect(ctx.get("finally")).toEqual("finally");
    });
  });
});
