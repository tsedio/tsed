import {DmmfModel} from "../generator/domain/DmmfModel.js";
import dmmfUserModel from "./dmmfUserModel.json";

export function createDmmfModelFixture() {
  return new DmmfModel(dmmfUserModel as any);
}
