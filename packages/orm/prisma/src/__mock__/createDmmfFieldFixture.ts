import {DmmfField} from "../generator/domain/DmmfField";

export interface FieldFixtureOptions {
  kind: string;
  name: string;
  isRequired: boolean;
  isNullable: boolean;
  type: string;
  isList: boolean;
  documentation: string;
  isInputType: boolean;
}

export function createDmmfFieldFixture(options: Partial<FieldFixtureOptions> = {}) {
  return new DmmfField({
    field: {
      name: "user",
      isRequired: false,
      type: "User",
      isList: false,
      ...options
    },
    schemaArg: {
      ...options
    },
    model: {
      isInputType: options.isInputType,
      addImportDeclaration: jest.fn()
    }
  });
}
