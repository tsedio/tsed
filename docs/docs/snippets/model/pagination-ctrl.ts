import {QueryParams} from "@tsed/platform-params";
import {Get, Returns} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {Pageable} from "../models/Pageable";
import {Pagination} from "../models/Pagination";
import {Product} from "../models/Product";

@Controller("/pageable")
class ProductsCtrl {
  @Get("/")
  @Returns(206, Pagination).Of(Product).Title("PaginatedProduct")
  @Returns(200, Pagination).Of(Product).Title("PaginatedProduct")
  async get(@QueryParams() pageableOptions: Pageable, @QueryParams("all") all: boolean) {
    return new Pagination<Product>({
      data: [
        new Product({
          id: "100",
          title: "CANON D3000"
        })
      ],
      totalCount: all ? 1 : 100, // just for test,
      pageable: pageableOptions
    });
  }
}
