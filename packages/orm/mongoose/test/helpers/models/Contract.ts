import {Model, ObjectID, Ref} from "../../../src/index";
import {TestCustomer} from "./Customer";

@Model({name: "testContract", schemaOptions: {timestamps: true}})
export class TestContract {
  @ObjectID()
  _id: string;

  @Ref(() => TestCustomer)
  customer: Ref<TestCustomer>;
}
