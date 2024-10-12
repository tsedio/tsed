import "../../src/index.js";

import {PlatformTest} from "@tsed/platform-http/testing";
import {array, CustomKey, getJsonSchema, number} from "@tsed/schema";
import {_, Ajv, KeywordCxt} from "ajv";

import {Keyword} from "../../src/decorators/keyword.js";
import {KeywordMethods} from "../../src/interfaces/KeywordMethods.js";

@Keyword({
  keyword: "range",
  type: "number",
  schemaType: "array",
  implements: ["exclusiveRange"],
  metaSchema: array().items([number(), number()]).minItems(2).additionalItems(false)
})
class RangeKeyword implements KeywordMethods {
  compile([min, max]: number[], parentSchema: any) {
    return parentSchema.exclusiveRange === true ? (data: any) => data > min && data < max : (data: any) => data >= min && data <= max;
  }
}

@Keyword({
  keyword: "even",
  type: "number",
  schemaType: "boolean"
})
class EvenKeyword implements KeywordMethods {
  code(cxt: KeywordCxt) {
    const {data, schema} = cxt;
    const op = schema ? _`!==` : _`===`;
    cxt.fail(_`${data} %2 ${op} 0`);
  }
}

export class Product {
  @CustomKey("range", [10, 100])
  @CustomKey("exclusiveRange", true)
  price: number;
}

describe("Keywords", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should call custom keyword validation (compile)", () => {
    const ajv = PlatformTest.get<Ajv>(Ajv);
    const schema = {range: [2, 4], exclusiveRange: true};

    const validate = ajv.compile(schema);

    expect(validate(2.01)).toEqual(true);
    expect(validate(3.99)).toEqual(true);
    expect(validate(2)).toEqual(false);
    expect(validate(4)).toEqual(false);
  });
  it("should call custom keyword validation (code)", () => {
    const ajv = PlatformTest.get<Ajv>(Ajv);
    const schema = {even: true};

    const validate = ajv.compile(schema);

    expect(validate(2)).toEqual(true);
    expect(validate(3)).toEqual(false);
  });

  it("should call custom keyword validation (model)", () => {
    const ajv = PlatformTest.get<Ajv>(Ajv);
    const schema = getJsonSchema(Product, {customKeys: true});

    const validate = ajv.compile(schema);

    expect(schema).toEqual({
      properties: {
        price: {
          exclusiveRange: true,
          range: [10, 100],
          type: "number"
        }
      },
      type: "object"
    });
    expect(validate({price: 10.01})).toEqual(true);
    expect(validate({price: 99.99})).toEqual(true);
    expect(validate({price: 10})).toEqual(false);
    expect(validate({price: 100})).toEqual(false);
  });
});
