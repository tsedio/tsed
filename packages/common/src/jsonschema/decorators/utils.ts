import * as Sinon from "sinon";
import * as mod from "../../../src/jsonschema/utils/decoratorSchemaFactory";

export function stubSchemaDecorator() {
  return Sinon.stub(mod, "decoratorSchemaFactory");
}
