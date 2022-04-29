import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {Constant, Injectable} from "../../src";

describe("@Constant()", () => {
  beforeEach(() =>
    PlatformTest.create({
      expression: "hello"
    })
  );
  afterEach(() => PlatformTest.reset());

  it("should create constant property", async () => {
    // GIVEN
    @Injectable()
    class Test {
      @Constant("expression")
      test: string;
    }

    // WHEN
    const service = await PlatformTest.invoke<Test>(Test);
    const result = service.test;

    // THEN
    expect(result).to.eq("hello");
  });
});
