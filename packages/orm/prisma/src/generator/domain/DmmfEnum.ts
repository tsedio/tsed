import {DMMF} from "@prisma/generator-helper";
import {ImportDeclarationStructure, StructureKind} from "ts-morph";

export class DmmfEnum {
  readonly model: DMMF.DatamodelEnum;
  readonly modelType: DMMF.SchemaEnum;

  #imports = new Map<string, ImportDeclarationStructure>();

  constructor({model, modelType}: {model: DMMF.DatamodelEnum; modelType: DMMF.SchemaEnum}) {
    this.model = model;
    this.modelType = modelType;
  }

  get name() {
    return this.model.name;
  }

  get values() {
    return this.modelType.values;
  }

  static getEnums(dmmf: DMMF.Document, enumsMap: Map<string, DMMF.DatamodelEnum>) {
    const enums = dmmf.schema.enumTypes.model || [];

    return enums.map(
      (modelType) =>
        new DmmfEnum({
          modelType,
          model: enumsMap.get(modelType.name) as unknown as DMMF.DatamodelEnum
        })
    );
  }

  static symbolName(name: string) {
    return `${name}`;
  }

  toString() {
    return DmmfEnum.symbolName(this.name);
  }
}
