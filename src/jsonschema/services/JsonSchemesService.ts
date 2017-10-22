import {JSONSchema4} from "json-schema";
import {Type} from "../../core/interfaces";
import {Service} from "../../di/decorators/service";
import {ServerSettingsService} from "../../server/services/ServerSettingsService";
import {JsonSchemesRegistry, ProxyJsonSchemesRegistry} from "../registries/JsonSchemesRegistry";


@Service()
export class JsonSchemesService extends ProxyJsonSchemesRegistry {

    constructor(private serverSettingsServer: ServerSettingsService) {
        super();
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