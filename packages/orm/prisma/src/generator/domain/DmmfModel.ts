import {DMMF} from "@prisma/generator-helper";
import {toMap} from "@tsed/core";
import {ImportDeclarationStructure, StructureKind} from "ts-morph";
import {isEsm} from "../utils/sourceType.js";
import {DmmfField} from "./DmmfField.js";
import {pascalCase} from "change-case";

export class DmmfModel {
  readonly isInputType: boolean;
  readonly model: DMMF.Model;
  readonly modelType: DMMF.InputType | DMMF.OutputType;
  #imports = new Map<string, ImportDeclarationStructure>();

  constructor({isInputType, model, modelType}: any) {
    this.model = model;
    this.modelType = modelType;
    this.isInputType = isInputType;
  }

  get name() {
    return this.model.name;
  }

  get fields() {
    const dataField = toMap<string, DMMF.SchemaArg>(this.modelType.fields as any, "name");

    return this.model.fields.map((field) => {
      return new DmmfField({
        model: this,
        field,
        schemaArg: dataField.get(field.name)
      });
    });
  }

  get importDeclarations() {
    return [...this.#imports.values()];
  }

  static getModels(dmmf: DMMF.Document, modelsMap: Map<string, DMMF.Model>, typesMap?: Map<string, DMMF.Model>): DmmfModel[] {
    const inputObjectsTypes = dmmf.schema.inputObjectTypes.model || [];
    const outputObjectTypes = dmmf.schema.outputObjectTypes.model || [];

    const factory = (isInputType: boolean) => (modelType: DMMF.InputType | DMMF.OutputType) => {
      let model = modelsMap.get(modelType.name) || typesMap?.get(modelType.name);

      if (model) {
        return new DmmfModel({
          modelType,
          model,
          isInputType
        });
      }

      return undefined;
    };

    const inputs: DmmfModel[] = inputObjectsTypes.map(factory(true)).filter(Boolean) as DmmfModel[];
    const outputs: DmmfModel[] = outputObjectTypes.map(factory(false)).filter(Boolean) as DmmfModel[];

    return [...inputs, ...outputs];
  }

  static symbolName(name: string) {
    return pascalCase(`${name}Model`);
  }

  addImportDeclaration(moduleSpecifier: string, name: string, isDefault = false) {
    if (!this.#imports.has(moduleSpecifier)) {
      console.log("===moduleSpecifier", moduleSpecifier);

      if (isEsm() && moduleSpecifier.startsWith(".")) {
        moduleSpecifier = `${moduleSpecifier}.js`;
      }

      this.#imports.set(moduleSpecifier, {
        kind: StructureKind.ImportDeclaration,
        moduleSpecifier: moduleSpecifier,
        namedImports: []
      });
    }

    const moduleDeclaration = this.#imports.get(moduleSpecifier)!;

    if (isDefault) {
      moduleDeclaration.defaultImport = name;
    } else {
      const nameImports = moduleDeclaration.namedImports as any[];
      if (!nameImports.includes(name)) {
        nameImports.push(name);
      }
    }

    return this;
  }

  toString() {
    return DmmfModel.symbolName(this.name);
  }
}
