import {Property} from "@tsed/common";
import {Model, Ref, VirtualRef, VirtualRefs} from "@tsed/mongoose";

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
    localField: "name",  // Find people where `localField`
    foreignField: "band", // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: false,
    options: {} // Query options, see http://bit.ly/mongoose-query-options
  })
  members: VirtualRefs<Person>;
}

@Model()
export class MyRef {
  @VirtualRef("MyModel")
  virtual: VirtualRef<MyModel>;

  @VirtualRef("MyModel")
  virtuals: VirtualRefs<MyModel>;
}

@Model()
export class MyModel {
  @Ref(MyRef)
  ref: Ref<MyRef>;
}
