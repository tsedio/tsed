import {Model, ObjectID, Ref} from "@tsed/mongoose";
import {CollectionOf} from "@tsed/schema";
import {TestContract} from "./Contract";

@Model({name: "testCustomer", schemaOptions: {timestamps: true}})
export class TestCustomer {
  @ObjectID()
  _id: string;

  @Ref(() => TestContract)
  @CollectionOf(() => TestContract)
  contracts?: Ref<TestContract>[];
}
