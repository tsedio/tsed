import {GenericOf, Generics, getJsonSchema, Property} from "@tsed/schema";

enum AdjustmentType {
  PRICE = "price",
  DELAY = "delay"
}

@Generics("T")
class UserProperty<T> {
  @Property("T")
  value: T;
}

class Adjustment {
  @GenericOf(AdjustmentType)
  adjustment: UserProperty<AdjustmentType>;
}

console.log(getJsonSchema(Adjustment));
/* OUTPUT:
{
  "properties": {
    "adjustment": {
      "properties": {
        "value": {
          "enum": [
            "price"
            "delay"
          ],
          "type": "string"
        }
      },
      "type": "object"
    }
  },
  "type": "object"
}
*/
