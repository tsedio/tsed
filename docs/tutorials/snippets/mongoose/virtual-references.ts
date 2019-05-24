import {Model, Ref, VirtualRef, VirtualRefs} from "@tsed/mongoose";

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
