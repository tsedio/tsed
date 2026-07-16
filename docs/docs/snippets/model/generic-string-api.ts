import {GenericOf, Generics, Property, s} from "@tsed/schema";

@Generics("T")
class UserProperty<T> {
  @Property("T")
  value: T;
}

class Adjustment {
  @GenericOf(s.string().pattern(/[a-z]/))
  adjustment: UserProperty<string>;
}

console.log(s.compile(Adjustment));
/* OUTPUT:
{
  "properties": {
    "adjustment": {
      "properties": {
        "value": {
          "type": "string",
          "pattern": "[a-z]"
        }
      },
      "type": "object"
    }
  },
  "type": "object"
}
*/
