import * as mod from "../../../../src/common/jsonschema/utils/decoratorSchemaFactory";
import {Sinon} from "../../../tools";

export function stubSchemaDecorator() {
    return Sinon.stub(mod, "decoratorSchemaFactory");
}