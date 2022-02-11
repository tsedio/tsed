import {getSpec, Post, Returns, SpecTypes} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Pagination} from "../models/Pagination";
import {Product} from "../models/Product";

@Controller("/")
class MyController {
  @Post("/")
  @Returns(200, Pagination).Of(Product).Description("description")
  async method(): Promise<Pagination<Product> | null> {
    return null;
  }
}

const spec = getSpec(MyController, {specType: SpecTypes.OPENAPI});

console.log(spec);
