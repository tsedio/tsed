import {GenericOf, Generics, getJsonSchema, Property} from "@tsed/schema";

@Generics("T")
class UserProperty<T> {
  @Property("T")
  value: T;
}

class Adjustment {
  @GenericOf(Date)
  adjustment: UserProperty<Date>;
}

console.log(getJsonSchema(Adjustment));
/* OUTPUT:
{
  "properties": {
    "adjustment": {
      "properties": {
        "value": {
          "format": "date-time",
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  "type": "object"
}
*/
