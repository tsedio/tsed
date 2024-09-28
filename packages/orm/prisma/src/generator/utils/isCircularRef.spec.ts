import {createContextFixture} from "../../__mock__/createContextFixture.js";
import {isCircularRef} from "./isCircularRef.js";

const ctx = createContextFixture();

describe("isCircularRef()", () => {
  it("should return true (self-ref)", () => {
    expect(isCircularRef("User", "User", ctx)).toEqual(true);
  });
  it("should return true (circular-ref)", () => {
    expect(isCircularRef("User", "Role", ctx)).toEqual(true);
  });
  it("should return true (transitive ref)", () => {
    expect(isCircularRef("User", "Transitive", ctx)).toEqual(true);
  });
  it("should return false", () => {
    expect(isCircularRef("User", "Other", ctx)).toEqual(false);
  });
  it("should return false (transitive)", () => {
    expect(isCircularRef("User", "Hello", ctx)).toEqual(false);
  });
});
