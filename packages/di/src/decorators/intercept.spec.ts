import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {Injectable, Intercept, InterceptorContext, InterceptorMethods} from "../../src";

describe("@Intercept", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should add interceptor on method", async () => {
    // GIVEN
    @Injectable()
    class TestInterceptor implements InterceptorMethods {
      intercept(ctx: InterceptorContext<any>) {
        const result = ctx.next();

        return {result, options: ctx.options, args: ctx.args};
      }
    }

    @Injectable()
    class TestService {
      @Intercept(TestInterceptor, {options: "options"})
      test(...args: any[]) {
        return `hello ${args.length}`;
      }
    }

    // WHEN
    await PlatformTest.invoke<TestInterceptor>(TestInterceptor);
    const service = await PlatformTest.invoke<TestService>(TestService);
    const result = service.test("arg1");

    // THEN
    expect(result).to.deep.equal({
      args: ["arg1"],
      options: {
        options: "options"
      },
      result: "hello 1"
    });
  });
  it("should add interceptor on class and decorate all methods", async () => {
    // GIVEN
    @Injectable()
    class TestInterceptor implements InterceptorMethods {
      intercept(ctx: InterceptorContext<any>) {
        const result = ctx.next();

        return {result, options: ctx.options, args: ctx.args};
      }
    }

    // WHEN
    @Intercept(TestInterceptor, {options: "options"})
    @Injectable()
    class TestService {
      test(...args: any[]) {
        return `hello ${args.length}`;
      }
    }

    await PlatformTest.invoke<TestInterceptor>(TestInterceptor);
    const service = await PlatformTest.invoke<TestService>(TestService);
    const result = service.test("arg1");

    // THEN
    expect(result).to.deep.equal({
      args: ["arg1"],
      options: {
        options: "options"
      },
      result: "hello 1"
    });
  });
});
