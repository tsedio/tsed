import {PlatformTest} from "@tsed/common";
import {Property} from "@tsed/schema";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import {Model, MongooseModel, MongooseService, ObjectID} from "@tsed/mongoose";
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
    beforeEach(async () => {
      const config: any = await TestMongooseContext.install();

      await PlatformTest.bootstrap(Server, {
        mongoose: [
          {
            id: "customer",
            url: config.url,
            connectionOptions: {
              ...config.connectionOptions,
              dbName: "customerDB"
            }
          },
          {
            id: "product",
            url: config.url,
            connectionOptions: {
              ...config.connectionOptions,
              dbName: "productDB"
            }
          }
        ]
      })();
    });
    afterEach(TestMongooseContext.clearDatabase);
    afterEach(TestMongooseContext.reset);

    it("should create connection and set models with the right connection", () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);

      expect(mongooseService.connections.size).toBe(2);
      expect(mongooseService.get()!.name).toBe("customerDB");
      expect(mongooseService.get("product")!.name).toBe("productDB");
      expect(mongooseService.get("customer")!.name).toBe("customerDB");

      const customerAccountModel = PlatformTest.get<MongooseModel<CustomerAccount>>(CustomerAccount);
      const productDataModel = PlatformTest.get<MongooseModel<ProductData>>(ProductData);

      expect(customerAccountModel.db.name).toBe("customerDB");
      expect(productDataModel.db.name).toBe("productDB");
    });

    it("should create connection and set models with the right connection (2)", () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);

      expect(mongooseService.connections.size).toBe(2);
      expect(mongooseService.get()!.name).toBe("customerDB");
      expect(mongooseService.get("product")!.name).toBe("productDB");
      expect(mongooseService.get("customer")!.name).toBe("customerDB");

      const customerAccountModel = PlatformTest.get<MongooseModel<CustomerAccount>>(CustomerAccount);
      const productDataModel = PlatformTest.get<MongooseModel<ProductData>>(ProductData);

      expect(customerAccountModel.db.name).toBe("customerDB");
      expect(productDataModel.db.name).toBe("productDB");
    });
  });
});
