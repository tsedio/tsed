import {ConverterService, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {OnDeserialize} from "./propertyDeserialize";

describe("@OnSerialize", () => {
  it(
    "should use function onDeserialize to Deserialize property",
    PlatformTest.inject([ConverterService], (converterService: ConverterService) => {
      class Test {
        @OnDeserialize((v) => v + "to")
        test: string;
      }

      const result = converterService.deserialize({test: "test"}, Test);

      expect(result).to.be.instanceof(Test);
      expect(result.test).to.eq("testto");
    })
  );
});
