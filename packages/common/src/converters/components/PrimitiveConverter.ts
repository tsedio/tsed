import {BadRequest} from "ts-httpexceptions";
import {Converter} from "../decorators/converter";
import {IConverter} from "../interfaces/index";

/**
 * Converter component for the `String`, `Number` and `Boolean` Types.
 * @converters
 * @component
 */
@Converter(String, Number, Boolean)
export class PrimitiveConverter implements IConverter {
  deserialize(data: string, target: any): String | Number | Boolean | void | null {
    switch (target) {
      case String:
        return "" + data;

      case Number:
        if ([null, "null"].includes(data)) return null;

        const n = +data;

        if (isNaN(n)) {
          throw new BadRequest("Cast error. Expression value is not a number.");
        }

        return n;

      case Boolean:
        if (["true", "1", true].includes(data)) return true;
        if (["false", "0", false].includes(data)) return false;
        if ([null, "null"].includes(data)) return null;
        if (data === undefined) return undefined;

        return !!data;
    }
  }

  serialize(object: String | Number | Boolean): any {
    return object;
  }
}
