import {PlatformTest} from "@tsed/platform-http/testing";
import {Property} from "@tsed/schema";
import {TestContainersMongo} from "@tsed/testcontainers-mongo";
import {afterEach, beforeEach, describe, expect, it} from "vitest";

import {Model, MongooseModel, MongooseService, ObjectID} from "../src/index.js";
import {Server} from "./helpers/Server.js";

@Model({
  connection: "customer",
  collection: "accounts"
})
class CustomerAccount {
  @ObjectID()
  id: string;

  @Property()
  name: string;
}

// models/ProductData.ts
@Model({
  connection: "product",
  collection: "data"
})
class ProductData {
  @ObjectID()
  id: string;

  @Property()
  label: string;
}

describe("Mongoose", () => {
  describe("MultipleConnection", () => {
    beforeEach(() =>
      TestContainersMongo.bootstrap(Server, {
        mongoose: [
          TestContainersMongo.getMongoConnectionOptions("customer", {
            dbName: "customerDB"
          }),
          TestContainersMongo.getMongoConnectionOptions("product", {
            dbName: "productDB"
          })
        ]
      })()
    );
    afterEach(() => TestContainersMongo.reset());

    it("should create connection and set models with the right connection", () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);

      expect(mongooseService.connections.size).toBe(2);
      expect(mongooseService.get()!.name).toContain("customerDB");
      expect(mongooseService.get("product")!.name).toContain("productDB");
      expect(mongooseService.get("customer")!.name).toContain("customerDB");

      const customerAccountModel = PlatformTest.get<MongooseModel<CustomerAccount>>(CustomerAccount);
      const productDataModel = PlatformTest.get<MongooseModel<ProductData>>(ProductData);

      expect(customerAccountModel.db.name).toContain("customerDB");
      expect(productDataModel.db.name).toContain("productDB");
    });

    it("should create connection and set models with the right connection (2)", () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);

      expect(mongooseService.connections.size).toBe(2);
      expect(mongooseService.get()!.name).toContain("customerDB");
      expect(mongooseService.get("product")!.name).toContain("productDB");
      expect(mongooseService.get("customer")!.name).toContain("customerDB");

      const customerAccountModel = PlatformTest.get<MongooseModel<CustomerAccount>>(CustomerAccount);
      const productDataModel = PlatformTest.get<MongooseModel<ProductData>>(ProductData);

      expect(customerAccountModel.db.name).toContain("customerDB");
      expect(productDataModel.db.name).toContain("productDB");
    });
  });
});
