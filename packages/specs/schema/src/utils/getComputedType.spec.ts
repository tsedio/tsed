import {getComputedType} from "./getComputedType.js";

describe("getComputedType", () => {
  it("should return the right class (String)", () => {
    expect(getComputedType(String)).toEqual(String);
  });
  it("should return the right class (Number)", () => {
    expect(getComputedType(Number)).toEqual(Number);
  });
  it("should return the right class (Boolean)", () => {
    expect(getComputedType(Boolean)).toEqual(Boolean);
  });
  it("should return the right class (Symbol)", () => {
    expect(getComputedType(Symbol)).toEqual(Symbol);
  });
  it("should return the right class (Date)", () => {
    expect(getComputedType(Date)).toEqual(Date);
  });
  it("should return the right class (Array)", () => {
    expect(getComputedType(Array)).toEqual(Array);
  });
  it("should return the right class (Map)", () => {
    expect(getComputedType(Map)).toEqual(Map);
  });
  it("should return the right class (Set)", () => {
    expect(getComputedType(Set)).toEqual(Set);
  });
  it("should return the right class (Promise)", () => {
    expect(getComputedType(Promise)).toEqual(Object);
  });
  it("should return the right class (class with arrow)", () => {
    class Test {}

    expect(getComputedType(() => Test)).toEqual(Test);
  });
  it("should return the right class (class)", () => {
    class Test {}

    expect(getComputedType(Test)).toEqual(Test);
  });

  it("should return the right class (undefined)", () => {
    expect(getComputedType(undefined)).toEqual(undefined);
  });
});
