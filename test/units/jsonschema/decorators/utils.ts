import * as mod from "../../../../src/jsonschema/utils/decoratorSchemaFactory";
import {Sinon} from "../../../tools";

export function stubSchemaDecorator() {
    return Sinon.stub(mod, "decoratorSchemaFactory");
}