import {DITest} from "../../node/index.js";
import {Constant, constant} from "./constant.js";

describe("@Constant()", () => {
  beforeEach(() =>
    DITest.create({
      logger: {
        level: "off"
      }
    })
  );
  afterEach(() => DITest.reset());
  describe("when decorator is used as property decorator", () => {
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
  describe("when constant is used as default value initializer", () => {
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
});
