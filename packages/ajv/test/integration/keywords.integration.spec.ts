import "@tsed/ajv";
import {PlatformTest} from "@tsed/common/src";
import Ajv from "ajv";
import {expect} from "chai";
import {Keyword} from "../../src/decorators/keyword";
import {KeywordMethods} from "../../src/interfaces/KeywordMethods";

@Keyword({
  keyword: "range",
  type: "number",
  schemaType: "array",
  implements: ["exclusiveRange"]
})
class IdExistsKeyword implements KeywordMethods {
  compile([min, max]: number[], parentSchema: any) {
    return parentSchema.exclusiveRange === true
      ? (data: any) => data > min && data < max
      : (data: any) => data >= min && data <= max;
  }
}

describe("Keywords", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should call custom keyword validation", () => {
    const ajv = PlatformTest.get<Ajv>(Ajv);
    const schema = {range: [2, 4], exclusiveRange: true};

    const validate = ajv.compile(schema);

    expect(validate(2.01)).to.eq(true);
    expect(validate(3.99)).to.eq(true);
    expect(validate(2)).to.eq(false);
    expect(validate(4)).to.eq(false);
  });
});