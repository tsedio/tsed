import {GenericOf, Generics, getJsonSchema, Property, string} from "@tsed/schema";

@Generics("T")
class UserProperty<T> {
  @Property("T")
  value: T;
}

class Adjustment {
  @GenericOf(string().pattern(/[a-z]/))
  adjustment: UserProperty<string>;
}

console.log(getJsonSchema(Adjustment));
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
