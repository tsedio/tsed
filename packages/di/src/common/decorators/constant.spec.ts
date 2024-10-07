import {DITest} from "../../node/index.js";
import {Constant} from "./constant.js";

describe("@Constant()", () => {
  beforeEach(() =>
    DITest.create({
      logger: {
        level: "off"
      }
    })
  );
  afterEach(() => DITest.reset());
  it("should create a getter", async () => {
    // WHEN
    class Test {
      @Constant("logger.level", "default value")
      test: string;
    }

    // THEN

    const test = await DITest.invoke<Test>(Test);

    expect(test.test).toEqual("off");
  });
  it("should create a getter with default value", async () => {
    // WHEN
    class Test {
      @Constant("logger.test", "default value")
      test: string;
    }

    // THEN

    const test = await DITest.invoke<Test>(Test);

    expect(test.test).toEqual("default value");
  });
  it("shouldn't be possible to modify injected value from injector.settings", async () => {
    // WHEN
    class Test {
      @Constant("logger.level")
      test: string;
    }

    // THEN

    const test = await DITest.invoke<Test>(Test);

    test.test = "new value";

    expect(test.test).toEqual("off");
  });
  it("should create a getter with native default value", async () => {
    // WHEN
    class Test {
      @Constant("logger.test")
      test: string = "default prop";
    }

    // THEN

    const test = await DITest.invoke<Test>(Test);

    expect(test.test).toEqual("default prop");
  });
});
