import {catchError} from "@tsed/core";

import {DITest} from "../../node/index.js";
import {InterceptorContext} from "../interfaces/InterceptorContext.js";
import {InterceptorMethods} from "../interfaces/InterceptorMethods.js";
import {InjectorService} from "../services/InjectorService.js";
import {getInterceptorOptions, Intercept} from "./intercept.js";
import {Interceptor} from "./interceptor.js";
import {Service} from "./service.js";

@Interceptor()
class MyInterceptor implements InterceptorMethods {
  intercept(context: InterceptorContext<any>) {
    const r = typeof context.args[0] === "string" ? undefined : new Error(`Error message`);
    const retValue = context.next(r);

    return `${retValue} - ${context.options || ""} - intercepted`;
  }
}

@Service()
class ServiceTest {
  @Intercept(MyInterceptor, "options data")
  exec(param: string) {
    return `Original data - ${param}`;
  }
}

@Service()
@Intercept(MyInterceptor, "options data")
class ServiceTest2 {
  exec(param: string) {
    return `Original data - ${param}`;
  }
}

describe("@Intercept", () => {
  beforeEach(() => DITest.create());
  afterEach(() => DITest.reset());

  describe("when the decorator is used on a method", () => {
    it("should intercept the method", async () => {
      // GIVEN
      const serviceTest = await DITest.invoke<ServiceTest>(ServiceTest)!;

      // WHEN
      const result = serviceTest.exec("param data");

      expect(getInterceptorOptions(ServiceTest, "exec")).toEqual("options data");

      // THEN
      expect(result).toEqual("Original data - param data - options data - intercepted");
    });
    it("should intercept the method and mock interceptor", async () => {
      // GIVEN
      const serviceTest = await DITest.invoke<ServiceTest>(ServiceTest, [
        {
          token: MyInterceptor,
          use: {
            intercept: vi.fn().mockReturnValue("intercepted")
          }
        }
      ]);

      // WHEN
      const result = serviceTest.exec("param data");

      // THEN
      expect(result).toEqual("intercepted");
    });
    it("should intercept the method and throw error", async () => {
      // GIVEN
      const serviceTest = await DITest.invoke<ServiceTest>(ServiceTest)!;

      // WHEN
      let actualError = catchError(() => serviceTest.exec({} as any));

      // THEN
      expect(actualError?.message).toEqual("Error message");
    });
  });
  describe("when the decorator is used on a class", () => {
    it("should intercept the method", async () => {
      // GIVEN
      const serviceTest = await DITest.invoke<ServiceTest2>(ServiceTest2)!;

      // WHEN
      const result = serviceTest.exec("param data");

      // THEN
      expect(result).toEqual("Original data - param data - options data - intercepted");
    });
    it("should intercept the method and throw error", async () => {
      // GIVEN
      const serviceTest = await DITest.invoke<ServiceTest2>(ServiceTest2)!;

      // WHEN
      let actualError = catchError(() => serviceTest.exec({} as any));
      // THEN
      expect(actualError?.message).toEqual("Error message");
    });
  });
});
