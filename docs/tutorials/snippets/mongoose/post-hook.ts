import {Model, ObjectID, PostHook} from "@tsed/mongoose";
import {Required} from "@tsed/schema";

@Model()
@PostHook("save", (car: CarModel) => {
  if (car.topSpeedInKmH > 300) {
    console.log(car.model, "is fast!");
  }
})
export class CarModel {
  @ObjectID("id")
  _id: string;

  @Required()
  model: string;

  @Required()
  isFast: boolean;

  // or Prehook on static method
  @PostHook("save")
  static postSave(car: CarModel) {
    if (car.topSpeedInKmH > 300) {
      console.log(car.model, "is fast!");
    }
  }
}
