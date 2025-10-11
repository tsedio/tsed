import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {array, number, object, Returns, Schema, string} from "@tsed/schema";

const ProductSchema = object({
  id: string().required().description("Product ID"),
  title: string().required().minLength(3).example("CANON D300").description("Product title"),
  price: number().minimum(0).example(100).description("Product price"),
  description: string().description("Product description"),
  tags: array()
    .minItems(1)
    .items(string().minLength(2).maxLength(10).description("Product tag"))
    .description("Product tags")
}).label("ProductModel");

@Controller("/")
class MyController {
  @Post("/")
  @Returns(200).Description("description").Schema(ProductSchema)
  method(@BodyParams() @Schema(ProductSchema) product: any): Promise<null> {
    return Promise.resolve(null);
  }
}
