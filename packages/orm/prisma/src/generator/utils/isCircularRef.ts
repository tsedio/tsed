import {TransformContext} from "../domain/TransformContext";
import {DMMF} from "@prisma/generator-helper";

export function isCircularRef(modelName: string, fieldType: string, ctx: TransformContext): boolean {
  if (modelName === fieldType) {
    return true;
  }

  const relation1 = ctx.modelsMap.get(modelName);
  const relation2 = ctx.modelsMap.get(fieldType);

  return Boolean(relation1 && relation2 && hasModelInFields(relation1, fieldType, ctx) && hasModelInFields(relation2, modelName, ctx));
}

function hasModelInFields(model: DMMF.Model, relation: string, ctx: TransformContext, inspected: string[] = []): boolean {
  return !!model.fields.find((field) => {
    if (field.type === relation) {
      return true;
    }

    if (!inspected.includes(field.type)) {
      const nextModel = ctx.modelsMap.get(field.type);

      if (nextModel) {
        return hasModelInFields(nextModel, relation, ctx, [...inspected, field.type]);
      }
    }

    return false;
  });
}
