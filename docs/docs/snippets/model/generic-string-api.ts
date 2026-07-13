import {compile, GenericOf, Generics, Property, string} from "@tsed/schema";

@Generics("T")
class UserProperty<T> {
  @Property("T")
  value: T;
}

class Adjustment {
  @GenericOf(string().pattern(/[a-z]/))
  adjustment: UserProperty<string>;
}

console.log(compile(Adjustment));
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
