import {isString} from "@tsed/core";
import {
  array,
  CollectionOf,
  Default,
  Description,
  For,
  Generics,
  Integer,
  Min,
  MinLength,
  oneOf,
  Property,
  SpecTypes,
  string
} from "@tsed/schema";

import {OnDeserialize, serialize} from "../../src/index.js";

class Pageable {
  @Integer()
  @Min(0)
  @Default(0)
  @Description("Page number.")
  page: number = 0;

  @Integer()
  @Min(1)
  @Default(20)
  @Description("Number of objects per page.")
  size: number = 20;

  @For(SpecTypes.JSON, oneOf(string(), array().items(string()).maxItems(2)))
  @For(SpecTypes.OPENAPI, array().items(string()).maxItems(2))
  @OnDeserialize((value: string | string[]) => (isString(value) ? value.split(",") : value))
  @Description("Sorting criteria: property(,asc|desc). Default sort order is ascending. Multiple sort criteria are supported.")
  sort: string | string[];

  constructor(options: Partial<Pageable>) {
    options.page && (this.page = options.page);
    options.size && (this.size = options.size);
    options.sort && (this.sort = options.sort);
  }

  get offset() {
    return this.page ? this.page * this.limit : 0;
  }

  get limit() {
    return this.size;
  }
}

@Generics("T")
class Pagination<T> extends Pageable {
  @CollectionOf("T")
  data: T[];

  @Integer()
  @MinLength(0)
  totalCount: number = 0;

  constructor({data, totalCount, pageable}: Partial<Pagination<T>> & {pageable: Pageable}) {
    super(pageable);
    data && (this.data = data);
    totalCount && (this.totalCount = totalCount);
  }

  get isPaginated() {
    return this.data.length < this.totalCount;
  }
}

class Product {
  @Property()
  id: string;

  @Property()
  title: string;

  constructor({id, title}: Partial<Product> = {}) {
    id && (this.id = id);
    title && (this.title = title);
  }
}

describe("Pageable", () => {
  it("should serialize a pageable object", () => {
    const pageableOptions = new Pageable({
      page: 1,
      size: 10,
      sort: ["field", "asc"]
    });

    const pagination = new Pagination<Product>({
      data: [
        new Product({
          id: "100",
          title: "CANON D3000"
        })
      ],
      totalCount: 1, // just for test
      pageable: pageableOptions
    });

    expect(serialize(pagination)).toEqual({
      data: [
        {
          id: "100",
          title: "CANON D3000"
        }
      ],
      page: 1,
      size: 10,
      sort: ["field", "asc"],
      totalCount: 1
    });
  });
});
