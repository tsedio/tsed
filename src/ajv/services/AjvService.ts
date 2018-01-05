import * as Ajv from "ajv";
import {ErrorObject} from "ajv";
import {BadRequest} from "ts-httpexceptions";
import {OverrideService} from "../../di/decorators/overrideService";
import {JsonSchemesService} from "../../jsonschema/services/JsonSchemesService";
import {ValidationService} from "../../filters/services/ValidationService";
import { ServerSettingsService } from "../../config/services/ServerSettingsService";
import { IAjvSettings, IAjvOptions, ErrorFormatter } from "../interfaces/IAjvSettings";
import { deepExtends } from "../../index";
import { $log } from "ts-log-debug";

@OverrideService(ValidationService)
export class AjvService extends ValidationService {

    private errorFormatter: ErrorFormatter;
    private options: IAjvOptions;

    constructor(private jsonSchemaService: JsonSchemesService,
                private serverSettingsService: ServerSettingsService) {
        super();

        const ajvSettings = this.serverSettingsService.get<IAjvSettings>("ajv");
        this.options = deepExtends({
            verbose: false
        }, ajvSettings && ajvSettings.options ? ajvSettings.options : {} );
       const defaultFormatter =  (error: any) => `{{name}}${error.dataPath} ${error.message} (${error.keyword})`;
       this.errorFormatter = ajvSettings && ajvSettings.errorFormat ? ajvSettings.errorFormat : defaultFormatter;
    }

    public validate(obj: any, targetType: any, baseType?: any): void {
        let schema = <any>this.jsonSchemaService.getSchemaDefinition(targetType);
        if (schema) {
            const ajv = new Ajv(this.options);
            const valid = ajv.validate(schema, obj);
            if (!valid) {
                throw(this.buildErrors(ajv.errors!));
            }
        }
    }

    private buildErrors(errors: ErrorObject[]) {
        $log.debug("AJV errors: ", errors);
        const message = errors.map(this.errorFormatter).join("\n");
        return new BadRequest(message);
    }
}