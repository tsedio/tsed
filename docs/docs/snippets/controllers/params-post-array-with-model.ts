import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Property} from "@tsed/schema";

class Product {
  @Property()
  title: string;
}

@Controller("/products")
export class ProductsCtrl {
  @Post()
  updatePayload(@BodyParams(Product) products: Product[]): Product[] {
    console.log("products", products);

    return products;
  }
}
