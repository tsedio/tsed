// patch model
import {classOf} from "@tsed/core";
import {serialize} from "@tsed/json-mapper";
import {Model} from "objection";

Model.prototype.toJSON = function toJSON(opt: any) {
  const obj = this.$toJson(opt);

  if (opt && opt.endpoint) {
    return serialize(obj, {type: classOf(this), ...opt});
  }

  return obj;
};
