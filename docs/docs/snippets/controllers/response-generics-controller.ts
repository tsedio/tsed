import {PathParams} from "@tsed/platform-params";
import {Get, Name, Returns, Summary} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {Document} from "../../domain/document/Documents";
import {Product} from "../../domain/product/Product";
import {ProductTypes} from "../../domain/product/ProductTypes";

@Controller("/products")
@Name("Products")
export class ProductsCtrl {
  @Get("/:id")
  @Returns(200, Document).Of(Product).Description("A product")
  @Returns(404, NotFound).Description("Product not found")
  @Summary("Return a product from the given Id")
  async geProduct(@PathParams("id") id: string): Promise<Document<Product>> {
    if (id === "AGAC") {
      const product = new Product({
        id: "AGAC",
        label: "Agadir",
        type: ProductTypes.VILLA,
        description: "An awesome resort at AGADIR"
      });

      return new Document<Product>({
        data: product,
        links: []
      });
    }

    throw new NotFound("Product not found");
  }
}
