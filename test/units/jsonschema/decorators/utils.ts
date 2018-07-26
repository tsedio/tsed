import * as mod from "../../../../packages/common/jsonschema/utils/decoratorSchemaFactory";
import {Sinon} from "../../../tools";

export function stubSchemaDecorator() {
  return Sinon.stub(mod, "decoratorSchemaFactory");
}
