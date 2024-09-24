import {Model, Ref, VirtualRef, VirtualRefs} from "@tsed/mongoose";
import {Property} from "@tsed/schema";

@Model()
class Person {
  @Property()
  name: string;

  @Property()
  band: string;
}

@Model()
class Band {
  @VirtualRef({
    ref: Person, // The model to use
    localField: "name", // Find people where `localField`
    foreignField: "band", // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: false,
    options: {} // Query options, see http://bit.ly/mongoose-query-options
  })
  members: VirtualRefs<Person>;

  @VirtualRef({
    ref: Person, // The model to use
    localField: "name", // Find people where `localField`
    foreignField: "band", // is equal to `foreignField`
    // If `count` is true, 'memberCount' will be the number of documents
    // instead of an array.
    count: true
  })
  memberCount: number;
}

@Model()
export class MyRef {
  @VirtualRef({ref: "MyModel", justOne: true})
  virtual: VirtualRef<MyModel>;

  @VirtualRef("MyModel")
  virtuals: VirtualRefs<MyModel>;
}

@Model()
export class MyModel {
  @Ref(MyRef)
  ref: Ref<MyRef>;
}
