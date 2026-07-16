import {Post, Returns, s, SpecTypes} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Pagination} from "../models/Pagination";
import {Product} from "../models/Product";

@Controller("/")
class MyController {
  @Post("/")
  @(Returns(200, Pagination).Of(Product).Description("description"))
  method(): Promise<Pagination<Product> | null> {
    return Promise.resolve(null);
  }
}

const spec = s.oas(MyController, {specType: SpecTypes.OPENAPI});

console.log(spec);
