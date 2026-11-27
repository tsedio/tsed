import {CollectionOf, DateTime, Enum, Integer, Min, MinLength, Property, Required} from "@tsed/schema";

export class OrderItem {
  @Required()
  @MinLength(1)
  sku: string;

  @Required()
  @Integer()
  @Min(1)
  quantity: number;

  @Required()
  @Min(0)
  price: number;
}

export class Order {
  @Required()
  id: string;

  @Required()
  customer: string;

  @Required()
  @Enum("pending", "paid")
  status: string;

  @Required()
  @DateTime()
  createdAt: Date;

  @Required()
  @CollectionOf(OrderItem)
  items: OrderItem[];

  @Property()
  total?: number;
}
