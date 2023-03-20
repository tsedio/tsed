import {DateFormat} from "@tsed/schema";
import moment, {Moment} from "moment";
import {getJsonMapperTypes} from "../../src/domain/JsonMapperTypesContainer";
import {serialize} from "../../src/utils/serialize";
import {JsonMapper} from "../../src/decorators/jsonMapper";
import {JsonMapperMethods} from "../../src/interfaces/JsonMapperMethods";

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

    expect(serialize(data.date)).toEqual("20220101");
    expect(serialize(data)).toEqual({
      date: "20220101"
    });

    getJsonMapperTypes().delete("Moment");

    expect(serialize(data)).toEqual({
      date: moment("2022-01-01").toJSON()
    });
  });
});
