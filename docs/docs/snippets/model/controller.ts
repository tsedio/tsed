import {BodyParams, Controller, Post} from "@tsed/common";
import {MyModel} from "../models/MyModel";

@Controller("/")
export class PersonsCtrl {

  @Post("/")
  save(@BodyParams() model: MyModel): MyModel {
    console.log(model instanceof MyModel); // true
    return model; // will be serialized according to your annotation on MyModel class.
  }

  // OR

  @Post("/")
  save(@BodyParams("person") model: MyModel): MyModel {
    console.log(model instanceof MyModel); // true
    return model; // will be serialized according to your annotation on Person class.
  }
}
