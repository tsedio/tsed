import {JsonMapper, JsonMapperMethods} from "@tsed/json-mapper";
import moment, {Moment} from "moment";

@JsonMapper(Date, "Moment")
export class MomentMapper implements JsonMapperMethods {
  deserialize(data: string): Moment {
    return moment(data, ["YYYY-MM-DD hh:mm:ss"]);
  }

  serialize(data: Date | Moment): string {
    return moment(data).format("YYYY-MM-DD hh:mm:ss");
  }
}
