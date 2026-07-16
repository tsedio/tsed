import {GenericOf, Generics, Property, s} from "@tsed/schema";

@Generics("T")
class UserProperty<T> {
  @Property("T")
  value: T;
}

class Adjustment {
  @GenericOf(s.date().format("date-time"))
  adjustment: UserProperty<Date>;
}

console.log(s.compile(Adjustment));
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
