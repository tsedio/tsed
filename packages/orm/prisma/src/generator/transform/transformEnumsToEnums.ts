import type {EnumMemberStructure, OptionalKind, StatementStructures} from "ts-morph";
import {StructureKind} from "ts-morph";

import type {DmmfEnum} from "../domain/DmmfEnum.js";

export function transformEnumsToEnums(enumModel: DmmfEnum): StatementStructures {
  const members: OptionalKind<EnumMemberStructure>[] = enumModel.values.map((value) => {
    return {
      name: value,
      value: value
    };
  });

  return {
    kind: StructureKind.Enum,
    name: enumModel.toString(),
    trailingTrivia: "\n",
    leadingTrivia: "\n",
    isExported: true,
    members
  };
}
