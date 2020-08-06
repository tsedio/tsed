import * as Sinon from "sinon";
import * as mod from "../../../src/jsonschema/utils/decoratorSchemaFactory";

/**
 * @deprecated Will be removed in v6
 * @ignore
 */
export function stubSchemaDecorator() {
  return Sinon.stub(mod, "decoratorSchemaFactory");
}
