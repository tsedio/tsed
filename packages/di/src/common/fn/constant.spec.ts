import {DITest} from "../../node/index.js";
import {constant} from "../fn/constant.js";

describe("constant()", () => {
  beforeEach(() =>
    DITest.create({
      logger: {
        level: "off"
      }
    })
  );
  afterEach(() => DITest.reset());
  it("should inject constant to the property", async () => {
    // WHEN
    class Test {
      test: string = constant("logger.level", "default value");
    }

    // THEN

    const test = await DITest.invoke<Test>(Test);

    expect(test.test).toEqual("off");
  });
  it("should return the default value if expression is undefined", async () => {
    // WHEN
    class Test {
      test: string = constant("logger.test", "default value");
    }

    // THEN

    const test = await DITest.invoke<Test>(Test);

    expect(test.test).toEqual("default value");
  });
});
