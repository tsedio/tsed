import {ConverterService, PlatformTest} from "@tsed/common";
import {expect} from "chai";
import {OnSerialize} from "./propertySerialize";

describe("@OnSerialize", () => {
  it("should use function to Deserialize property", async () => {
    const converterService = await PlatformTest.invoke<ConverterService>(ConverterService, []);

    class Test {
      @OnSerialize(v => v + "to")
      test: string;
    }

    const input = new Test();
    input.test = "test";

    const result = converterService.serialize(input);

    expect(result).to.be.not.instanceof(Test);
    expect(result.test).to.eq("testto");
  });
});
