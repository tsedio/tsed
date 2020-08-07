import {Ignore, ModelStrict, Property, Required} from "@tsed/common";

class Product {
  @Property()
  name: string;

  @Property()
  categoryId: number;

  @Property()
  description: string;
}

@ModelStrict(true)
export class UserProductPostModel extends Product {
  @Required()
  name: string;

  @Ignore()
  categoryId: number;

  @Property()
  description: string;
}

@ModelStrict(true)
export class AdminProductPostModel extends Product {
  @Required()
  name: string;

  @Required()
  categoryId: number;

  @Property()
  description: string;
}
