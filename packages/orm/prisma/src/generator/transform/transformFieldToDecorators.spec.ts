import {createContextFixture} from "../../__mock__/createContextFixture.js";
import {createDmmfFieldFixture} from "../../__mock__/createDmmfFieldFixture.js";
import {PrismaScalars} from "../domain/ScalarTsTypes.js";
import {transformFieldToDecorators} from "./transformFieldToDecorators.js";

describe("transformFieldToDecorators()", () => {
  it("should transform String to decorator", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String
    });
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["String"],
        kind: 6,
        name: "Property"
      }
    ]);
  });

  it("should transform String to string (Required)", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true
    });
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["String"],
        kind: 6,
        name: "Property"
      },
      {
        arguments: [],
        kind: 6,
        name: "Required"
      }
    ]);
  });

  it("should transform String to string (Required + null)", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true,
      isNullable: true
    });
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["String"],
        kind: 6,
        name: "Property"
      },
      {
        arguments: [],
        kind: 6,
        name: "Required"
      },
      {
        arguments: ["null"],
        kind: 6,
        name: "Allow"
      }
    ]);
  });

  it("should transform String to string (Required + null + List)", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.String,
      isRequired: true,
      isNullable: true,
      isList: true
    });
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["String"],
        kind: 6,
        name: "CollectionOf"
      },
      {
        arguments: [],
        kind: 6,
        name: "Required"
      }
    ]);
  });

  it("should transform Int to number", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.Int
    });
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["Number"],
        kind: 6,
        name: "Property"
      },
      {
        arguments: [],
        kind: 6,
        name: "Integer"
      }
    ]);
  });

  it("should transform DateTime to Date", () => {
    const field = createDmmfFieldFixture({
      kind: "scalar",
      type: PrismaScalars.DateTime
    });
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["Date"],
        kind: 6,
        name: "Property"
      },
      {
        arguments: ['"date-time"'],
        kind: 6,
        name: "Format"
      }
    ]);
  });

  it("should transform enumTypes to Date", () => {
    const field = createDmmfFieldFixture({
      kind: "enum",
      type: "Role"
    });
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["Role"],
        kind: 6,
        name: "Enum"
      }
    ]);
  });

  it("should transform User to User (self-ref)", () => {
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "User"
    });
    // @ts-ignore
    field.model.name = "User";
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["() => UserModel"],
        kind: 6,
        name: "Property"
      }
    ]);
  });

  it("should transform User to User", () => {
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "Role"
    });
    // @ts-ignore
    field.model.name = "User";
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["() => RoleModel"],
        kind: 6,
        name: "Property"
      }
    ]);
  });

  it("should transform User to User (list)", () => {
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "Role",
      isList: true
    });
    // @ts-ignore
    field.model.name = "User";
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["() => RoleModel"],
        kind: 6,
        name: "CollectionOf"
      }
    ]);
  });

  it("should transform User to User, Groups", () => {
    const field = createDmmfFieldFixture({
      kind: "object",
      type: "Role",
      documentation: '// @TsED.Groups("expression")'
    });
    // @ts-ignore
    field.model.name = "User";
    const ctx = createContextFixture();
    expect(transformFieldToDecorators(field, ctx)).toEqual([
      {
        arguments: ["() => RoleModel"],
        kind: 6,
        name: "Property"
      },
      {
        arguments: ['"expression"'],
        kind: 6,
        name: "Groups"
      }
    ]);
  });
});
