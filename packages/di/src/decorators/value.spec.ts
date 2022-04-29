import {PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {Value, Injectable} from "../../src";

describe("@Value()", () => {
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
      @Value("expression")
      test: string;
    }

    // WHEN
    const service = await PlatformTest.invoke<Test>(Test);
    const result = service.test;

    // THEN
    expect(result).to.eq("hello");
  });
});
