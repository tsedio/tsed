import {BodyParams, Controller, Get, Post, Returns, ReturnsArray} from "@tsed/common";
import {Person} from "../models/Person";

@Controller("/")
export class PersonsCtrl {

  @Post("/")
  @Returns(Person)
  async save1(@BodyParams() person: Person): Promise<Person> {
    console.log(person instanceof Person); // true

    return person; // will be serialized according to your annotation on Person class.
  }


  @Get("/")
  @ReturnsArray(Person)
  async getPersons(): Promise<Person[]> {
    return [
      new Person()
    ];
  }
}
