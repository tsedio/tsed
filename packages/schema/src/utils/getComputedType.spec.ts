import {expect} from "chai";
import {getComputedType} from "./getComputedType";

describe("getComputedType", () => {
  it("should return the right class (String)", () => {
    expect(getComputedType(String)).to.deep.eq(String);
  });
  it("should return the right class (Number)", () => {
    expect(getComputedType(Number)).to.deep.eq(Number);
  });
  it("should return the right class (Boolean)", () => {
    expect(getComputedType(Boolean)).to.deep.eq(Boolean);
  });
  it("should return the right class (Symbol)", () => {
    expect(getComputedType(Symbol)).to.deep.eq(Symbol);
  });
  it("should return the right class (Date)", () => {
    expect(getComputedType(Date)).to.deep.eq(Date);
  });
  it("should return the right class (Array)", () => {
    expect(getComputedType(Array)).to.deep.eq(Array);
  });
  it("should return the right class (Map)", () => {
    expect(getComputedType(Map)).to.deep.eq(Map);
  });
  it("should return the right class (Set)", () => {
    expect(getComputedType(Set)).to.deep.eq(Set);
  });
  it("should return the right class (Promise)", () => {
    expect(getComputedType(Promise)).to.deep.eq(Object);
  });
  it("should return the right class (class with arrow)", () => {
    class Test {}

    expect(getComputedType(() => Test)).to.deep.eq(Test);
  });
  it("should return the right class (class)", () => {
    class Test {}

    expect(getComputedType(Test)).to.deep.eq(Test);
  });

  it("should return the right class (undefined)", () => {
    expect(getComputedType(undefined)).to.deep.eq(undefined);
  });
});
