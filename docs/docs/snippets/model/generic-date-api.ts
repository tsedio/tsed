import {date, GenericOf, Generics, getJsonSchema, Property, string} from "@tsed/schema";

@Generics("T")
class UserProperty<T> {
  @Property("T")
  value: T;
}

class Adjustment {
  @GenericOf(date().format("date-time"))
  adjustment: UserProperty<Date>;
}

console.log(getJsonSchema(Adjustment));
/* OUTPUT:
{
  "properties": {
    "adjustment": {
      "properties": {
        "value": {
          "type": "string",
          "format": "date-time"
        }
      },
      "type": "object"
    }
  },
  "type": "object"
}
*/
