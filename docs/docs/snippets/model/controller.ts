import {BodyParams} from "@tsed/platform-params";
import {Post} from "@tsed/schema";
import {Controller} from "@tsed/di";
import {PersonModel} from "../models/PersonModel";

@Controller("/")
export class PersonsCtrl {
  @Post("/")
  save(@BodyParams() model: PersonModel): PersonModel {
    console.log(model instanceof PersonModel); // true
    return model; // will be serialized according to your annotation on PersonModel class.
  }

  // OR

  @Post("/")
  save(@BodyParams("person") model: PersonModel): PersonModel {
    console.log(model instanceof PersonModel); // true
    return model; // will be serialized according to your annotation on PersonModel class.
  }
}
