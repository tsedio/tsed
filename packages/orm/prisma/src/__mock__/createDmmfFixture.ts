import dmmf from "./dmmf.json" with {type: "json"};
import dmmfTypes from "./dmmf.types.json" with {type: "json"};
import dmmfMixedCase from "./dmmfMixedCase.json" with {type: "json"};

export function createDmmfFixture(): any {
  return dmmf;
}

export function createDmmfWithTypesFixture(): any {
  return dmmfTypes;
}

export function createDmmfMixedCaseFixture(): any {
  return dmmfMixedCase;
}
