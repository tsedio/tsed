import * as mod from "../../../src/jsonschema/utils/decoratorSchemaFactory";
import * as Sinon from "sinon";

export function stubSchemaDecorator() {
  return Sinon.stub(mod, "decoratorSchemaFactory");
}
