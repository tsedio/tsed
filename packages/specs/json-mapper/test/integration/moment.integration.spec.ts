import {DateFormat} from "@tsed/schema";
import moment, {Moment} from "moment";

import {JsonMapper} from "../../src/decorators/jsonMapper.js";
import {getJsonMapperTypes} from "../../src/domain/JsonMapperTypesContainer.js";
import {JsonSerializer} from "../../src/index.js";
import {JsonMapperMethods} from "../../src/interfaces/JsonMapperMethods.js";

class MyModel {
  @DateFormat()
  date: Moment;
}

@JsonMapper("Moment")
export class ApiDateMapper implements JsonMapperMethods {
  static serialize(data: any): string {
    return data ? moment(data).format("YYYYMMDD") : data;
  }

  static deserialize(data: any) {
    return data ? moment(data, ["YYYYMMDD"]) : data;
  }

  deserialize(data: any) {
    return ApiDateMapper.deserialize(data);
  }

  serialize(data: any): string {
    return ApiDateMapper.serialize(data);
  }
}

describe("Moment", () => {
  it("should serialize moment as expected", () => {
    const data = new MyModel();
    data.date = moment("2022-01-01");

    const serializer = new JsonSerializer();

    expect(serializer.map(data.date)).toEqual("20220101");
    expect(serializer.map(data)).toEqual({
      date: "20220101"
    });

    serializer.removeTypeMapper("Moment");

    const types = getJsonMapperTypes();
    types.delete("Moment");

    expect(
      serializer.map(data, {
        types
      })
    ).toEqual({
      date: moment("2022-01-01").toJSON()
    });
  });
});
