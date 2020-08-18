import {deserialize} from "@tsed/json-mapper";
import {Person} from "./Person";

describe("Person", () => {
  it("should deserialize a model", () => {
    const input = {
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"],
      job: "Tech lead"
    };

    const result = deserialize(input, {
      type: Person
    });

    expect(result).toBeInstanceOf(Person);
    expect(result).toEqual({
      firstName: "firstName",
      lastName: "lastName",
      age: 0,
      skills: ["skill1"],
      job: "Tech lead"
    });
  });
});
