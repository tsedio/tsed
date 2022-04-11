import {CollectionOf, Generics, Property} from "@tsed/schema";

@Generics("T")
class Pagination<T> {
  @CollectionOf("T")
  data: T[];

  @Property()
  totalCount: number;
}
