import {DMMF} from "@prisma/generator-helper";
import {toMap} from "@tsed/core";
import {ImportDeclarationStructure, StructureKind} from "ts-morph";
import {DmmfField} from "./DmmfField";
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

  static getModels(dmmf: DMMF.Document, modelsMap: Map<string, DMMF.Model>) {
    const inputObjectsTypes = dmmf.schema.inputObjectTypes.model || [];
    const outputObjectTypes = dmmf.schema.outputObjectTypes.model || [];

    const inputs = inputObjectsTypes.map(
      (modelType) =>
        new DmmfModel({
          modelType,
          model: modelsMap.get(modelType.name),
          isInputType: true
        })
    );

    const outputs = outputObjectTypes.map(
      (modelType) =>
        new DmmfModel({
          modelType,
          model: modelsMap.get(modelType.name),
          isInputType: false
        })
    );

    return [...inputs, ...outputs];
  }

  static symbolName(name: string) {
    return pascalCase(`${name}Model`);
  }

  addImportDeclaration(moduleSpecifier: string, name: string, isDefault = false) {
    if (!this.#imports.has(moduleSpecifier)) {
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
