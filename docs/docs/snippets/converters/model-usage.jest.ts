import {deserialize, serialize} from "@tsed/json-mapper";
import {Person} from "./Person";

describe("Person", () => {
  it("should deserialize a model", () => {
    const input = {
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"]
    };

    const result = deserialize(input, {
      type: Person
    });

    expect(result).toBeInstanceOf(Person);
    expect(result).toEqual({
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"]
    });
  });

  it("should serialize a model", () => {
    const person = new Person();
    person.firstName = "firstName";
    person.lastName = "lastName";
    person.person = 0;
    person.skills = ["skill1"];

    const result = serialize(person);

    expect(result).not.toBeInstanceOf(Person);
    expect(result).toEqual({
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"]
    });
  });
});
