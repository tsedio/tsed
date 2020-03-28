import {Email, Property, Required} from "@tsed/schema";
import {expect} from "chai";
import {getPropertiesStores} from "./getPropertiesStores";

class Base {
  @Property()
  id: string;

  @Email()
  email: string;
}

class Child extends Base {
  @Required()
  id: string;

  @Property()
  name: string;
}

describe("getProperties()", () => {
  it("should return properties", () => {
    const properties = getPropertiesStores(Child);
    expect(Array.from(properties.keys())).to.deep.eq(["id", "email", "name"]);
    const properties2 = getPropertiesStores(Child);
    expect(Array.from(properties2.keys())).to.deep.eq(["id", "email", "name"]);
  });
});
