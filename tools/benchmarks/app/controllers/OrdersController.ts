import {Controller} from "@tsed/di";
import {deserialize} from "@tsed/json-mapper";
import {BodyParams, QueryParams} from "@tsed/platform-params";
import {Get, Integer, Max, Min, Post, Required, Returns} from "@tsed/schema";

import {ORDERS, totalOf} from "../fixtures.js";
import {Order} from "../models/Order.js";

@Controller("/orders")
export class OrdersController {
  // built once: the route measures the serialization of the response, not the creation of the orders
  #orders: Order[] = deserialize(ORDERS, {type: Order, collectionType: Array});

  @Get("/")
  @(Returns(200, Array).Of(Order))
  list(@QueryParams("size") @Integer() @Min(1) @Max(1000) size: number): Order[] {
    return this.#orders.slice(0, size);
  }

  @Post("/")
  @Returns(200, Order)
  create(@BodyParams() @Required() order: Order): Order {
    order.total = totalOf(order);

    return order;
  }
}
