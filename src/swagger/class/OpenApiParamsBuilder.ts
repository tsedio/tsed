/**
 * @module swagger
 */
/** */
import { BodyParameter, Parameter, Schema, BaseParameter } from "swagger-schema-official";
import {Type} from "../../core/interfaces";
import {deepExtends} from "../../core/utils";

import { ParamMetadata } from "../../mvc/class/ParamMetadata";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
import {swaggerType} from "../utils";
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
        let bodySchema: Schema | undefined = undefined;
        let bodyParam: BodyParameter = {} as BodyParameter;
        let required = false;
        this._parameters = <Parameter[]> this.injectedParams
            .map((param: ParamMetadata) => {
                const inType = ({
                    "BodyParamsFilter": "body",
                    "PathParamsFilter": "path",
                    "QueryParamsFilter": "query",
                    "HeaderParamsFilter": "header"
                } as any)[param.name];

                if (inType === undefined) { // not a input paramaters
                    return;
                }

                let baseParam: BaseParameter = this.createBaseParameter(inType, param);

                // Next assign type/schema:
                if (inType === "body") {
                    if (param.expression) {
                        bodySchema = deepExtends(bodySchema || {}, this.createSchema(param));
                        bodyParam = baseParam;
                    } else {
                        const builder = new OpenApiPropertiesBuilder(param.type);
                        builder.build();

                        deepExtends(this._definitions, builder.definitions);

                        return Object.assign(baseParam,
                            {
                                schema: {
                                    "$ref": `#/definitions/${param.typeName}`
                                }
                            }
                        );
                    }
                } else {
                    // Apply the schema to be backwards compatible...
                    return Object.assign(baseParam, param.store.get("schema") , {
                        type: swaggerType(param.type)
                    });
                }
            })
            .filter(o => !!o);

        if (bodySchema && bodyParam) {
            const model = `Model${this.MODEL_AUTO_INCREMENT}`;
            bodyParam.schema = {};
            bodyParam.schema["$ref"] = `#/definitions/${model}`;
            this._definitions[model] = bodySchema;
            this.MODEL_AUTO_INCREMENT++;
        }

        return this;
    }


    private createBaseParameter(inType: string, param: ParamMetadata): BaseParameter {
        let baseParam: BaseParameter = {
            name: (inType === "body") ? "body" : <string>param.expression,
            in: inType,
            required: !!param.required,
            description: ""
        };
        // override defaults with baseParameter
        return Object.assign(baseParam, param.store.get("baseParameter") );
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
            current.properties![key] = <Schema> {type: "object"};
            current = current.properties![key];
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