import {DateFormat} from "@tsed/schema";
import moment, {Moment} from "moment";
import {expect} from "chai";
import {JsonMapper, JsonMapperMethods, serialize} from "../../src";

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


describe("Moment", async () => {
  it("should serialize moment as expected", () => {
    const data = new MyModel();
    data.date = moment("2022-01-01");

    expect(serialize(data.date)).to.deep.eq("20220101");
    expect(serialize(data)).to.deep.eq({
      "date": "20220101"
    });
  });
});
