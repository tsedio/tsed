import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods";

/**
 * Converter component for the `Date` Type.
 * @jsonmapper
 * @converter
 * @component
 */
@JsonMapper(Date)
export class DateMapper implements JsonMapperMethods {
  deserialize(data: string): Date {
    return new Date(data);
  }

  serialize(object: Date): any {
    return object.toISOString();
  }
}
