import {transformScalarToType} from "./transformScalarToType";
import {createDmmfFieldFixture} from "../../__mock__/createDmmfFieldFixture";
import {PrismaScalars} from "../domain/ScalarTsTypes";

describe("transformScalarToType()", () => {
  it("should transform String to string", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String
    });
    expect(transformScalarToType(field)).toEqual("string | null");
  });

  it("should transform String to string (isInputType)", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isInputType: true
    });

    expect(transformScalarToType(field)).toEqual("string | undefined");
  });

  it("should transform String to string (Required)", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true
    });
    expect(transformScalarToType(field)).toEqual("string");
  });

  it("should transform String to string (Required + null)", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true,
      isNullable: true
    });
    expect(transformScalarToType(field)).toEqual("string | null");
  });

  it("should transform String to string (Required + null + List)", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true,
      isNullable: true,
      isList: true
    });
    expect(transformScalarToType(field)).toEqual("string[]");
  });

  it("should transform Int to number", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.Int
    });
    expect(transformScalarToType(field)).toEqual("number | null");
  });

  it("should transform DateTime to Date", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.DateTime
    });
    expect(transformScalarToType(field)).toEqual("Date | null");
  });

  it("should transform enumTypes to Date", () => {
    const field = createDmmfFieldFixture({
      kind: "enum",
      type: "Role"
    });
    expect(transformScalarToType(field)).toEqual("Role | null");
    expect(field.model.addImportDeclaration).toHaveBeenCalledWith("../enums", "Role");
  });

  it("should transform User to User (self-ref)", () => {
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "User"
    });
    // @ts-ignore
    field.model.name = "User";
    expect(transformScalarToType(field)).toEqual("UserModel | null");
    expect(field.model.addImportDeclaration).not.toHaveBeenCalled();
  });

  it("should transform User to User", () => {
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "Role"
    });
    // @ts-ignore
    field.model.name = "User";
    expect(transformScalarToType(field)).toEqual("RoleModel | null");
    expect(field.model.addImportDeclaration).toHaveBeenCalledWith("./RoleModel", "RoleModel");
  });
});
