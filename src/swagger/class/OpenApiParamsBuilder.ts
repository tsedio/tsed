import {BodyParameter, Parameter, Schema} from "swagger-schema-official";

import {ParamMetadata} from "../../mvc/class/ParamMetadata";
import {deepExtends} from "../../core/utils/index";
import {swaggerType} from "../utils/index";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
import {Type} from "../../core/interfaces/Type";
import {OpenApiPropertiesBuilder} from "./OpenApiPropertiesBuilder";

export class OpenApiParamsBuilder extends OpenApiPropertiesBuilder {
    private _parameters: Parameter[] = [];
    private MODEL_AUTO_INCREMENT = 1;
    private injectedParams: ParamMetadata[];

    constructor(target: Type<any>, methodClassName: string) {
        super(target);
        this.injectedParams = ParamRegistry.getParams(target, methodClassName);
    }

    build(): this {
        let bodySchema: Schema;
        let required = false;
        this._parameters = <Parameter[]> this.injectedParams
            .map((param: ParamMetadata) => {
                const inType = {
                    "BodyParamsFilter": "body",
                    "PathParamsFilter": "path",
                    "QueryParamsFilter": "query",
                    "HeaderParamsFilter": "header"
                }[param.name];

                if (inType === undefined) { // not a input paramaters
                    return;
                }
                if (inType !== "body") {
                    const schema = this.mapParam(param);
                    schema["in"] = inType;
                    return schema;
                }
                if (param.required) {
                    required = true;
                }

                if (param.expression) {
                    bodySchema = deepExtends(bodySchema || {}, this.createSchema(param));
                } else {
                    const builder = new OpenApiPropertiesBuilder(param.type);
                    builder.build();

                    deepExtends(this._definitions, builder.definitions);

                    return {
                        "in": "body",
                        name: "body",
                        description: "",
                        required: !!param.required,
                        schema: {
                            "$ref": `#/definitions/${param.typeName}`
                        }
                    };
                }
            })
            .filter(o => !!o);

        if (bodySchema) {
            let bodyParam: BodyParameter = {} as BodyParameter;
            // model name will be extract from metadata in future.
            const model = `Model${this.MODEL_AUTO_INCREMENT}`;

            bodyParam.in = "body";
            bodyParam.name = "body";
            bodyParam.description = "";
            bodyParam.required = required;
            bodyParam.schema = {};
            bodyParam.schema["$ref"] = `#/definitions/${model}`;
            this._parameters.push(bodyParam);

            this._definitions[model] = bodySchema;

            this.MODEL_AUTO_INCREMENT++;
        }

        return this;
    }

    /**
     *
     * @param param
     * @returns {T&{}}
     */
    private mapParam(param: ParamMetadata) {
        const {
            required,
            expression
        }
            = param;

        return Object.assign(param.store.get("schema") || {}, {
            name: expression,
            required,
            type: swaggerType(param.type)
        });
    }

    /**
     *
     * @param model
     * @returns {Schema}
     */
    protected createSchema(model: ParamMetadata): Schema {
        const keys = (model.expression as string || "").split(".");
        let builder;

        const output: Schema = {
            type: "object",
            properties: {}
        };

        let current = output;

        keys.forEach((key, index) => {
            current.properties[key] = <Schema> {type: "object"};
            current = current.properties[key];
        });

        if (model.isClass) {
            builder = new OpenApiPropertiesBuilder(model.type);
            builder.build();

            deepExtends(this._definitions, builder.definitions);
        } else {
            if (!model.isCollection) {
                delete current.properties;
            }
        }

        Object.assign(current, super.createSchema(model));

        return output;
    }

    public completeMissingPathParams(openAPIPath: string): Parameter[] {
        this._parameters = openAPIPath
            .split("/")
            .filter(keyPath => {
                if (keyPath.match(/{/)) {
                    const name = keyPath.replace(/{|}/, "");
                    return !this._parameters.find(o => o["in"] === "path" && o.name === name);
                }
            })
            .map<Parameter>(keyPath => ({
                in: "path",
                name: keyPath.replace(/{|}/gi, ""),
                type: "string",
                required: keyPath.indexOf("?") === -1
            }))
            .concat(this._parameters);

        return this._parameters;
    }

    public get parameters(): Parameter[] {
        return this._parameters;
    }
}