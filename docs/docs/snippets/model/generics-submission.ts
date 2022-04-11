import {Generics, Property} from "@tsed/schema";

@Generics("T")
class Submission<T> {
  @Property()
  _id: string;

  @Property("T")
  data: T;
}
