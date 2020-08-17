import {Ignore, AdditionalProperties, Property, Required} from "@tsed/schema";

class Product {
  @Property()
  name: string;

  @Property()
  categoryId: number;

  @Property()
  description: string;
}

@AdditionalProperties(false)
export class UserProductPostModel extends Product {
  @Required()
  name: string;

  @Ignore()
  categoryId: number;

  @Property()
  description: string;
}

@AdditionalProperties(false)
export class AdminProductPostModel extends Product {
  @Required()
  name: string;

  @Required()
  categoryId: number;

  @Property()
  description: string;
}
