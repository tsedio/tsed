import dmmf from "./dmmf.json";
import dmmfTypes from "./dmmf.types.json";

export function createDmmfFixture(): any {
  return dmmf;
}

export function createDmmfWithTypesFixture(): any {
  return dmmfTypes;
}
