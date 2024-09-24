import {Model, ObjectID, PreHook} from "@tsed/mongoose";
import {Required} from "@tsed/schema";

@Model()
@PreHook("save", (car: CarModel, next: any) => {
  if (car.model === "Tesla") {
    car.isFast = true;
  }
  next();
})
export class CarModel {
  @ObjectID("id")
  _id: string;

  @Required()
  model: string;

  @Required()
  isFast: boolean;

  // or Prehook on static method
  @PreHook("save")
  static preSave(car: CarModel, next: any) {
    if (car.model === "Tesla") {
      car.isFast = true;
    }
    next();
  }
}
