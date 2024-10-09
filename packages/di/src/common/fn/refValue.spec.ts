import {DITest} from "../../node/index.js";
import {configuration} from "./configuration.js";
import {refValue} from "./refValue.js";

describe("refValue()", () => {
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
        test = refValue("logger.level", "default value");
      }

      // THEN

      const test = await DITest.invoke<Test>(Test);

      expect(test.test.value).toEqual("off");
    });
    it("should create a getter with default value", async () => {
      expect(configuration().get("logger.test")).toEqual(undefined);

      // WHEN
      class Test {
        test = refValue("logger.test", "default value");
      }

      // THEN

      const test = await DITest.invoke<Test>(Test);

      expect(test.test.value).toEqual("default value");
      expect(configuration().get("logger.test")).toEqual(undefined);
    });
  });
});
