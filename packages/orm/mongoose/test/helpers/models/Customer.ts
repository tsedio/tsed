import {CollectionOf} from "@tsed/schema";

import {Model, ObjectID, Ref} from "../../..";
import {TestClient} from "./Client.js";
import {TestContract} from "./Contract.js";

@Model({name: "testCustomer", schemaOptions: {timestamps: true}})
export class TestCustomer {
  @ObjectID()
  _id: string;

  @Ref(() => TestContract)
  @CollectionOf(() => TestContract)
  contracts?: Ref<TestContract>[];

  @Ref(() => TestClient)
  client?: Ref<TestClient>;
}
