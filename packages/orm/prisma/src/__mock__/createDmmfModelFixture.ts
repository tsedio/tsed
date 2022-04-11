import {DmmfModel} from "../generator/domain/DmmfModel";

export function createDmmfModelFixture() {
  return new DmmfModel(require("./dmmfUserModel.json"));
}
