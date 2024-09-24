import {Decimal128, Model, NumberDecimal} from "@tsed/mongoose";
import {Property} from "@tsed/schema";

@Model()
export class ProductModel {
  @ObjectID("id")
  _id: string;

  @Property()
  sku: string;

  @NumberDecimal()
  price: Decimal128;
}
