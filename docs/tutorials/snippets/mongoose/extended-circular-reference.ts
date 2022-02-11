import {Required, CollectionOf} from "@tsed/schema";
import {Model, ObjectID} from "@tsed/mongoose";

@Model()
export class Customer {
  @ObjectID("id")
  _id: string;

  @Property()
  name: string;

  @Ref(() => Contract)
  @CollectionOf(() => Contract)
  contracts?: Ref<Contract>[];
}

@Model()
export class Contract {
  @ObjectID("id")
  _id: string;

  @Ref(() => Customer)
  customer: Ref<Customer>;

  @Required()
  contractName: string;
}
