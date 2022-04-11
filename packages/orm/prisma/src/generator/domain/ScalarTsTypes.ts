import {DecoratorStructure, StructureKind} from "ts-morph";

export enum PrismaScalars {
  String = "String",
  Boolean = "Boolean",
  Int = "Int",
  Float = "Float",
  BigInt = "BigInt",
  Decimal = "Decimal",
  DateTime = "DateTime",
  Json = "Json",
  Bytes = "Bytes"
}

export const ScalarTsTypes: Record<string, string> = {
  [PrismaScalars.String]: "string",
  [PrismaScalars.Boolean]: "boolean",
  [PrismaScalars.Int]: "number",
  [PrismaScalars.Float]: "number",
  [PrismaScalars.Decimal]: "number",
  [PrismaScalars.BigInt]: "bigint",
  [PrismaScalars.DateTime]: "Date",
  [PrismaScalars.Json]: "any",
  [PrismaScalars.Bytes]: "Buffer"
};

export const ScalarJsClasses: Record<string, string> = {
  [PrismaScalars.String]: "String",
  [PrismaScalars.Boolean]: "Boolean",
  [PrismaScalars.Int]: "Number",
  [PrismaScalars.Float]: "Number",
  [PrismaScalars.Decimal]: "Number",
  [PrismaScalars.BigInt]: "BigInt",
  [PrismaScalars.DateTime]: "Date",
  [PrismaScalars.Json]: "Object",
  [PrismaScalars.Bytes]: "Buffer"
};

export const ScalarDecorators: Record<string, Omit<DecoratorStructure, "kind">[]> = {
  [PrismaScalars.String]: [],
  [PrismaScalars.Boolean]: [],
  [PrismaScalars.Int]: [
    {
      name: "Integer",
      arguments: []
    }
  ],
  [PrismaScalars.Float]: [],
  [PrismaScalars.BigInt]: [],
  [PrismaScalars.Decimal]: [],
  [PrismaScalars.DateTime]: [{name: "Format", arguments: ['"date-time"']}],
  [PrismaScalars.Json]: [],
  [PrismaScalars.Bytes]: []
};
