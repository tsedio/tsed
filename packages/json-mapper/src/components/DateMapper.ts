import {JsonMapper} from "../decorators/jsonMapper";
import {JsonMapperMethods} from "../interfaces/JsonMapperMethods";

/**
 * Mapper for `Date` type.
 * @jsonmapper
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
