import {Minimum, Name, Required} from "@tsed/schema";
import moment from "moment";

import {OnSerialize} from "../../src/decorators/onSerialize.js";
import {deserialize} from "../../src/utils/deserialize.js";
import {serialize} from "../../src/utils/serialize.js";

function serializeDate(date: Date) {
  return date && moment(date).format("YYYYMMDD");
}

class ProductCalendarParameters {
  @Required()
  @Minimum(1)
  duration: number;

  @Name("first_date")
  @OnSerialize(serializeDate)
  @Required()
  firstDate: Date;

  @Name("last_date")
  @OnSerialize(serializeDate)
  @Required()
  lastDate: Date;

  @Name("number_of_adults")
  numberOfAdults: number;

  @Name("departure_option_id")
  departureOptionId: string;
}

describe("Date mapper", () => {
  it("should serialize object correctly", () => {
    const productCalendarParameters = deserialize(
      {
        duration: 7,
        first_date: "2020-11-13T14:48:24.651Z",
        last_date: "2020-12-13T14:48:24.652Z",
        number_of_adults: 2
      },
      {type: ProductCalendarParameters}
    );

    expect(productCalendarParameters).toEqual({
      duration: 7,
      firstDate: new Date("2020-11-13T14:48:24.651Z"),
      lastDate: new Date("2020-12-13T14:48:24.652Z"),
      numberOfAdults: 2
    });

    expect(serialize(productCalendarParameters)).toEqual({
      duration: 7,
      first_date: "20201113",
      last_date: "20201213",
      number_of_adults: 2
    });
  });
});
