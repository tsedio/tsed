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
  deserialize(data: string, target: any): String | Number | Boolean | void {
    switch (target) {
      case String:
        return "" + data;

      case Number:
        const n = +data;

        if (isNaN(n)) {
          throw new BadRequest("Cast error. Expression value is not a number.");
        }

        return n;

      case Boolean:
        if (data === "true") return true;
        if (data === "false") return false;

        return !!data;
    }
  }

  serialize(object: String | Number | Boolean): any {
    return object;
  }
}
