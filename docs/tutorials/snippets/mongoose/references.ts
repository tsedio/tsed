import {Model, ObjectID, Ref} from "@tsed/mongoose";

@Model()
export class MyRef {
  @ObjectID("id")
  _id: string;
}

@Model()
export class MyModel {
  @Ref(MyRef)
  ref: Ref<MyRef>;

  @Ref(MyRef)
  refs: Ref<MyRef>[];

  @Ref(MyRef)
  refs: Map<string, MyRef>;
}
