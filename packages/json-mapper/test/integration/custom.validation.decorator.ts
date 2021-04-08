import {catchAsyncError, constructorOf} from "@tsed/core/src";
import {BadRequest} from "@tsed/exceptions/src";
import {Property} from "@tsed/schema/src";
import {expect} from "chai";
import {deserialize} from "../../src";
import {BeforeDeserialize} from "../../src/decorators/beforeDeserialize";

class Company {
  @Property()
  name: string;
  @Property()
  @RequiredIf((value: any, data: any) => data.name === "tsed" && value === undefined)
  location: string;
}

function RequiredIf(cb: any) {
  return (target: any, property: string) => {
    BeforeDeserialize((data) => {
      if (!cb(data[property], data)) {
        throw new BadRequest(`${property} is required!`);
      }
      return data;
    })(constructorOf(target));
  };
}

describe("CustomValidationDecorator", () => {
  it("should try to deserialize and throw a bad request error", async () => {
    // GIVEN
    const company = {
      name: "tsed"
    };

    // WHEN
    const badRequestError = await catchAsyncError(() => deserialize(company, {type: Company}));

    // THEN
    expect(badRequestError).to.be.instanceof(BadRequest);
  });
});
