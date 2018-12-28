import * as mod from "../../../../packages/common/src/jsonschema/utils/decoratorSchemaFactory";
import * as Sinon from "sinon";

export function stubSchemaDecorator() {
  return Sinon.stub(mod, "decoratorSchemaFactory");
}
