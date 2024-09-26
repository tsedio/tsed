import type {Type} from "@tsed/core";

const statusesModel: Map<number, Type<any>> = new Map();

export function defineStatusModel(status: number, model: Type<any>) {
  statusesModel.set(status, model);
}

export function getStatusModel(status: number) {
  return statusesModel.get(status);
}
