import {CollectionOf, Default, Generics, Integer, MinLength} from "@tsed/schema";
import {Pageable} from "./Pageable";

@Generics("T")
class Pagination<T> extends Pageable {
  @CollectionOf("T")
  data: T[];

  @Integer()
  @MinLength(0)
  @Default(0)
  totalCount: number = 0;

  constructor({data, totalCount, pageable}: Partial<Pagination<T>> & {pageable: Pageable}) {
    super(pageable);
    data && (this.data = data);
    totalCount && (this.totalCount = totalCount);
  }
}
