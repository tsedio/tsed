import {Model, NumberDecimal} from "@tsed/mongoose";
import Big from "big.js";

@Model()
export class PriceModel {
  @NumberDecimal(Big)
  price: Big;
}
