import {GenericOf, Generics, getJsonSchema, Property} from "@tsed/schema";

@Generics("T")
class UserProperty<T> {
  @Property("T")
  value: T;
}

class Adjustment {
  @GenericOf(String)
  adjustment: UserProperty<string>;
}

console.log(getJsonSchema(Adjustment));
/* OUTPUT:
{
  "properties": {
    "adjustment": {
      "properties": {
        "value": {
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  "type": "object"
}
*/
