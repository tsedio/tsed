import {DITest} from "../../node/index.js";
import {configuration} from "../fn/configuration.js";
import {Value} from "./value.js";

describe("@Value()", () => {
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
        @Value("logger.level", "default value")
        test: string;
      }

      // THEN

      const test = await DITest.invoke<Test>(Test);

      expect(test.test).toEqual("off");
    });
    it("should create a getter with default value", async () => {
      expect(configuration().get("logger.test")).toEqual(undefined);

      // WHEN
      class Test {
        @Value("logger.test", "default value")
        test: string;
      }

      // THEN

      const test = await DITest.invoke<Test>(Test);

      expect(test.test).toEqual("default value");
      expect(configuration().get("logger.test")).toEqual(undefined);
    });
    it("should create a getter with native default value", async () => {
      // WHEN
      class Test {
        @Value("logger.test")
        test: string = "default prop";
      }

      // THEN

      const test = await DITest.invoke<Test>(Test);

      expect(test.test).toEqual("default prop");
      expect(configuration().get("logger.test")).toEqual("default prop");
    });
  });
});
