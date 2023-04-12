import {JsonMapper, JsonMapperMethods} from "@tsed/json-mapper";
import moment, {Moment} from "moment";

@JsonMapper(Date, "Moment")
export class MomentMapper implements JsonMapperMethods {
  deserialize(data: string, ctx: JsonMapperCtx): Moment {
    return moment(data, ["YYYY-MM-DD hh:mm:ss"]);
  }

  serialize(data: Date | Moment, ctx: JsonMapperCtx): string {
    const format = ctx.options?.format;

    switch (format) {
      case "date":
        return moment(data).format("YYYY-MM-DD");
      default:
        return moment(data).format("YYYY-MM-DD hh:mm:ss");
    }
  }
}
