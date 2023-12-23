import {CollectionOf, Default, Generics, Integer, MinLength} from "@tsed/schema";
import {Pageable} from "./Pageable";

export class PaginationLink {
  @Property()
  next: string;

  @Property()
  prev: string;
}

@Generics("T")
export class Pagination<T> extends Pageable {
  @CollectionOf("T")
  data: T[];

  @Integer()
  @MinLength(0)
  @Default(0)
  totalCount: number = 0;

  @Property()
  links: PaginationLink = new PaginationLink();

  constructor({data, totalCount, pageable}: Partial<Pagination<T>> & {pageable: Pageable}) {
    super(pageable);
    data && (this.data = data);
    totalCount && (this.totalCount = totalCount);
  }
}
