import {DmmfModel} from "../generator/domain/DmmfModel.js";

export function createDmmfModelFixture() {
  return new DmmfModel(require("./dmmfUserModel.json"));
}
