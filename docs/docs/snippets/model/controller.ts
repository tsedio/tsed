import {BodyParams, Controller, Post} from "@tsed/common";
import {Person} from "../models/Person";

@Controller("/")
export class PersonsCtrl {

  @Post("/")
  save(@BodyParams() person: Person): Person {
    console.log(person instanceof Person); // true
    return person; // will be serialized according to your annotation on Person class.
  }

  // OR

  @Post("/")
  save(@BodyParams("person") person: Person): Person {
    console.log(person instanceof Person); // true
    return person; // will be serialized according to your annotation on Person class.
  }
}
