import * as Ajv from "ajv";
import {ErrorObject} from "ajv";
import {BadRequest} from "ts-httpexceptions";
import {$log} from "ts-log-debug";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Type} from "../../core/interfaces";
import {nameOf} from "../../core/utils";
import {OverrideService} from "../../di/decorators/overrideService";
import {ValidationService} from "../../filters/services/ValidationService";
import {JsonSchemesService} from "../../jsonschema/services/JsonSchemesService";
import {AjvErrorObject, ErrorFormatter, IAjvOptions, IAjvSettings} from "../interfaces/IAjvSettings";

@OverrideService(ValidationService)
export class AjvService extends ValidationService {

    private errorFormatter: ErrorFormatter;
    private options: IAjvOptions;

    constructor(private jsonSchemaService: JsonSchemesService,
                private serverSettingsService: ServerSettingsService) {
        super();

        const ajvSettings: IAjvSettings = this.serverSettingsService.get("ajv") || {};

        this.options = Object.assign({
            verbose: false
        }, ajvSettings.options || {});

        this.errorFormatter = ajvSettings.errorFormat ? ajvSettings.errorFormat : this.defaultFormatter;
    }

    /**
     *
     * @param obj
     * @param targetType
     * @param baseType
     * @returns {boolean}
     */
    public validate(obj: any, targetType: any, baseType?: any): boolean {
        let schema = <any>this.jsonSchemaService.getSchemaDefinition(targetType);
        if (schema) {
            const ajv = new Ajv(this.options);
            const valid = ajv.validate(schema, obj);
            if (!valid) {
                throw this.buildErrors(ajv.errors!, targetType);
            }
        }
        return true;
    }

    /**
     *
     * @param {ajv.ErrorObject[]} errors
     * @param {Type<any>} targetType
     * @returns {BadRequest}
     */
    private buildErrors(errors: ErrorObject[], targetType: Type<any>) {
        $log.debug("AJV errors: ", errors);

        const message = errors.map((error: AjvErrorObject) => {
            error.modelName = nameOf(targetType);
            return this.errorFormatter.call(this, error);
        }).join("\n");

        return new BadRequest(message);
    }

    /**
     *
     * @param error
     * @returns {string}
     */
    private defaultFormatter(error: AjvErrorObject) {
        let value = "";
        if (this.options.verbose) {
            value = `, value "${error.data}"`;
        }
        return `At ${error.modelName}${error.dataPath}${value} ${error.message}`;
    }
}