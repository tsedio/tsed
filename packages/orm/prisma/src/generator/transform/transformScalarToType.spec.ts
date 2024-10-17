import {createContextFixture} from "../../__mock__/createContextFixture.js";
import {createDmmfFieldFixture} from "../../__mock__/createDmmfFieldFixture.js";
import {PrismaScalars} from "../domain/ScalarTsTypes.js";
import {transformScalarToType} from "./transformScalarToType.js";

describe("transformScalarToType()", () => {
  it("should transform User to User (not null + circular ref)", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "Role",
      isRequired: true,
      isNullable: false
    });
    // @ts-ignore
    field.model.name = "User";
    expect(transformScalarToType(field, ctx)).toEqual("Relation<RoleModel>");
    expect(field.model.addImportDeclaration).toHaveBeenCalledWith("./RoleModel", "RoleModel");
    expect(field.model.addImportDeclaration).toHaveBeenCalledWith("@tsed/core", "Relation", true);
  });
  it("should transform String to string", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String
    });
    expect(transformScalarToType(field, ctx)).toEqual("string | null");
  });

  it("should transform String to string (isInputType)", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isInputType: true
    });

    expect(transformScalarToType(field, ctx)).toEqual("string | undefined");
  });

  it("should transform String to string (Required)", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true
    });
    expect(transformScalarToType(field, ctx)).toEqual("string");
  });

  it("should transform String to string (Required + null)", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true,
      isNullable: true
    });
    expect(transformScalarToType(field, ctx)).toEqual("string | null");
  });

  it("should transform String to string (Required + null + List)", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true,
      isNullable: true,
      isList: true
    });
    expect(transformScalarToType(field, ctx)).toEqual("string[]");
  });

  it("should transform Int to number", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.Int
    });
    expect(transformScalarToType(field, ctx)).toEqual("number | null");
  });

  it("should transform DateTime to Date", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.DateTime
    });
    expect(transformScalarToType(field, ctx)).toEqual("Date | null");
  });

  it("should transform enumTypes to Date", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "enum",
      type: "Role"
    });
    expect(transformScalarToType(field, ctx)).toEqual("Role | null");
    expect(field.model.addImportDeclaration).toHaveBeenCalledWith("../enums/index", "Role");
  });

  it("should transform User to User (self-ref)", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "User"
    });
    // @ts-ignore
    field.model.name = "User";
    expect(transformScalarToType(field, ctx)).toEqual("Relation<UserModel> | null");
    expect(field.model.addImportDeclaration).toHaveBeenCalledWith("@tsed/core", "Relation", true);
  });

  it("should transform Role to User", () => {
    const ctx = createContextFixture();
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "Role"
    });
    // @ts-ignore
    field.model.name = "User";
    expect(transformScalarToType(field, ctx)).toEqual("Relation<RoleModel> | null");
    expect(field.model.addImportDeclaration).toHaveBeenCalledWith("./RoleModel", "RoleModel");
  });
});
