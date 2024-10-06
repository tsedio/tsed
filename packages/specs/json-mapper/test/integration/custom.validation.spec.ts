import {catchAsyncError} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import {JsonEntityFn, Property} from "@tsed/schema";

import {BeforeDeserialize} from "../../src/decorators/beforeDeserialize.js";
import {deserialize} from "../../src/utils/deserialize.js";

class Company {
  @Property()
  name: string;
  @Property()
  @RequiredIf((value: any, data: any) => data.name === "tsed" && value !== undefined)
  location: string;
}

function RequiredIf(cb: any): PropertyDecorator {
  return JsonEntityFn((store, [target, propertyKey]) => {
    BeforeDeserialize((data) => {
      if (!cb(data[propertyKey], data)) {
        throw new BadRequest(`${String(propertyKey)} is required`);
      }
      return data;
    })(target);
  });
}

describe("CustomValidationDecorator", () => {
  it("should deserialize object correctly", () => {
    // GIVEN
    const company = {
      name: "tsed",
      location: "Paris"
    };

    // WHEN
    const companyAfterDeserialization = deserialize(company, {type: Company});

    // THEN
    expect(companyAfterDeserialization).toEqual({
      name: "tsed",
      location: "Paris"
    });
  });

  it("should try to deserialize and throw a bad request error", async () => {
    // GIVEN
    const company = {
      name: "tsed"
    };

    // WHEN
    const badRequestError = await catchAsyncError(() => deserialize(company, {type: Company}));

    // THEN
    expect(badRequestError).toBeInstanceOf(BadRequest);
  });
});
