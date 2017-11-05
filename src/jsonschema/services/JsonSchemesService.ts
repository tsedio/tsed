import {JSONSchema4} from "json-schema";
import {Type} from "../../core/interfaces";
import {Service} from "../../di/decorators/service";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";
import {ProxyRegistry} from "../../core/class/ProxyRegistry";
import {JsonSchema} from "../class/JsonSchema";


@Service()
export class JsonSchemesService extends ProxyRegistry<any, JsonSchema> {
    constructor() {
        super(JsonSchemesRegistry);
    }

    /**
     *
     * @param {Type<any>} target
     * @returns {JSONSchema4}
     */
    getSchemaDefinition(target: Type<any>): JSONSchema4 {
        return JsonSchemesRegistry.getSchemaDefinition(target);
    }

}