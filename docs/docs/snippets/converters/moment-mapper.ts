import {classOf} from "@tsed/core";
import {JsonMapper, JsonMapperMethods} from "@tsed/json-mapper";
import moment, {Moment} from "moment";

@JsonMapper(Date, classOf(moment()))
export class MomentMapper implements JsonMapperMethods {
  deserialize(data: string): Moment {
    return moment(data, ["YYYY-MM-DD hh:mm:ss"]);
  }

  serialize(data: Date | Moment): string {
    return moment(data).toDate().format("YYYY-MM-DD hh:mm:ss");
  }
}
