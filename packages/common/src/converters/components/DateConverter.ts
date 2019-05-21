import {Converter} from "../decorators/converter";
import {IConverter} from "../interfaces/index";

/**
 * Converter component for the `Date` Type.
 * @converters
 * @component
 */
@Converter(Date)
export class DateConverter implements IConverter {
  deserialize(data: string): Date {
    return new Date(data);
  }

  serialize(object: Date): any {
    return object.toISOString();
  }
}
