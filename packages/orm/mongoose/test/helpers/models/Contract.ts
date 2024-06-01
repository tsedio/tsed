import {Model, ObjectID, Ref} from "../../../src/index.js";
import {TestCustomer} from "./Customer.js";

@Model({name: "testContract", schemaOptions: {timestamps: true}})
export class TestContract {
  @ObjectID()
  _id: string;

  @Ref(() => TestCustomer)
  customer: Ref<TestCustomer>;
}
