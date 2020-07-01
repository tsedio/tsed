import {PlatformTest, Property} from "@tsed/common/src";
import {TestMongooseContext} from "@tsed/testing-mongoose/src";
import {expect} from "chai";
import {MongooseService} from "../src";
import {Model, ObjectID} from "../src/decorators";
import {MongooseModel} from "../src/interfaces";
import {Server} from "./helpers/Server";

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

      expect(mongooseService.connections.size).to.equal(2);
      expect(mongooseService.get()!.name).to.equal("customerDB");
      expect(mongooseService.get("product")!.name).to.equal("productDB");
      expect(mongooseService.get("customer")!.name).to.equal("customerDB");

      const customerAccountModel = PlatformTest.get<MongooseModel<CustomerAccount>>(CustomerAccount);
      const productDataModel = PlatformTest.get<MongooseModel<ProductData>>(ProductData);

      expect(customerAccountModel.db.name).to.equal("customerDB");
      expect(productDataModel.db.name).to.equal("productDB");
    });

    it("should create connection and set models with the right connection (2)", () => {
      const mongooseService = PlatformTest.get<MongooseService>(MongooseService);

      expect(mongooseService.connections.size).to.equal(2);
      expect(mongooseService.get()!.name).to.equal("customerDB");
      expect(mongooseService.get("product")!.name).to.equal("productDB");
      expect(mongooseService.get("customer")!.name).to.equal("customerDB");

      const customerAccountModel = PlatformTest.get<MongooseModel<CustomerAccount>>(CustomerAccount);
      const productDataModel = PlatformTest.get<MongooseModel<ProductData>>(ProductData);

      expect(customerAccountModel.db.name).to.equal("customerDB");
      expect(productDataModel.db.name).to.equal("productDB");
    });
  });
});
