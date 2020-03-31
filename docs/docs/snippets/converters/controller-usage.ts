import {BodyParams, Controller, Get, Post} from "@tsed/common";
import {Returns, ReturnsArray} from "@tsed/swagger";
import {Person} from "../models/Person";

@Controller("/")
export class PersonsCtrl {

  @Post("/")
  @Returns(Person) // tell to swagger that the endpoint return a Person
  async save1(@BodyParams() person: Person): Promise<Person> {
    console.log(person instanceof Person); // true

    return person; // will be serialized according to your annotation on Person class.
  }

  // OR
  @Post("/")
  @Returns(Person) // tell to swagger that the endpoint return a Person
  async save2(@BodyParams("person") person: Person): Promise<Person> {
    console.log(person instanceof Person); // true

    return person; // will be serialized according to your annotation on Person class.
  }

  @Get("/")
  @ReturnsArray(Person) // tell to swagger that the endpoint return an array of Person[]
  async getPersons(): Promise<Person[]> {
    return [
      new Person()
    ];
  }
}
