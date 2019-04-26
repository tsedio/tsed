import * as mod from "../../src/utils/decoratorSchemaFactory";
import * as Sinon from "sinon";

export function stubSchemaDecorator() {
  return Sinon.stub(mod, "decoratorSchemaFactory");
}
