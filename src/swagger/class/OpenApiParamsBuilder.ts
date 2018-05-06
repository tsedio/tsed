import {ParamMetadata, ParamRegistry} from "@tsed/common";
import {deepExtends, nameOf, Type} from "@tsed/core";
import {BaseParameter, BodyParameter, Parameter, Schema} from "swagger-schema-official";
import {swaggerType} from "../utils";
import {OpenApiModelSchemaBuilder} from "./OpenApiModelSchemaBuilder";

export class OpenApiParamsBuilder extends OpenApiModelSchemaBuilder {
    private _parameters: Parameter[] = [];
    private injectedParams: ParamMetadata[];
    private name: string = "";

    constructor(target: Type<any>, methodClassName: string) {
        super(target);
        this.name = `${nameOf(target)}${methodClassName.charAt(0).toUpperCase() + methodClassName.slice(1)}`;
        this.injectedParams = ParamRegistry.getParams(target, methodClassName);
    }

    build(): this {
        let bodySchema: Schema | undefined = undefined;
        let bodyParam: BodyParameter = {} as BodyParameter;

        this._parameters = <Parameter[]> this.injectedParams
            .map((param: ParamMetadata) => {
                if (param.store.get("hidden")) {
                    return;
                }

                const inType = ({
                    "BodyParamsFilter": "body",
                    "PathParamsFilter": "path",
                    "QueryParamsFilter": "query",
                    "HeaderParamsFilter": "header"
                } as any)[param.name];

                if (inType === undefined) { // not a input paramaters
                    return;
                }

                const baseParam: BaseParameter = this.createBaseParameter(inType, param);

                // Next assign type/schema:
                switch (inType) {
                    case "body":
                        if (param.expression) {
                            bodySchema = deepExtends(bodySchema || {}, this.createSchemaFromBodyParam(param));
                            bodyParam = baseParam;
                            return;
                        }

                        const builder = new OpenApiModelSchemaBuilder(param.type);
                        builder.build();

                        deepExtends(this._responses, builder.responses);
                        deepExtends(this._definitions, builder.definitions);

                        return Object.assign(baseParam,
                            {
                                schema: {
                                    "$ref": `#/definitions/${param.typeName}`
                                }
                            }
                        );

                    case "query":
                        return Object.assign(
                            baseParam,
                            param.store.get("schema"),
                            this.createSchemaFromQueryParam(param)
                        );

                    default:
                        // Apply the schema to be backwards compatible...
                        return Object.assign(baseParam, param.store.get("schema"), {
                            type: swaggerType(param.type)
                        });
                }
            })
            .filter(o => !!o);

        if (bodySchema && bodyParam) {
            const model = `${this.name}Payload`;
            bodyParam.schema = {};
            bodyParam.schema["$ref"] = `#/definitions/${model}`;

            this._parameters.push(bodyParam);
            this._definitions[model] = bodySchema;
        }

        return this;
    }

    /**
     *
     * @param {string} inType
     * @param {ParamMetadata} param
     * @returns {BaseParameter}
     */
    private createBaseParameter(inType: string, param: ParamMetadata): BaseParameter {
        const baseParam: BaseParameter = {
            name: (inType === "body") ? "body" : <string>param.expression,
            in: inType,
            required: !!param.required,
            description: ""
        };

        if (param.required) {
            this._responses[400] = {description: "Missing required parameter"};
        }
        // override defaults with baseParameter
        return deepExtends(baseParam, param.store.get("baseParameter") || {});
    }

    /**
     * Create Properties schema from an expression.
     * @param expression
     */
    private createSchemaFromExpression(expression: string = "") {
        const schema: Schema = {};
        let current = schema;

        if (!!expression) {
            const keys = expression.split(".");
            keys.forEach((key, index) => {
                current.type = "object";
                current.properties = current.properties || {};
                current.properties![key] = <Schema> {};
                current = current.properties![key];
            });
        }

        return {currentProperty: current, schema};
    }

    /**
     *
     * @param model
     * @returns {Schema}
     */
    protected createSchemaFromBodyParam(model: ParamMetadata): Schema {
        let builder;

        const {currentProperty, schema} = this.createSchemaFromExpression(model.expression as string);

        if (model.isClass) {
            builder = new OpenApiModelSchemaBuilder(model.type);
            builder.build();

            deepExtends(this._definitions, builder.definitions);
            deepExtends(this._responses, builder.responses);
        }

        Object.assign(currentProperty, super.createSchema(model));

        return schema;
    }

    /**
     *
     * @param {ParamMetadata} model
     * @returns {Schema}
     */
    protected createSchemaFromQueryParam(model: ParamMetadata): Schema {
        const type = swaggerType(model.type);
        if (model.isCollection) {
            if (model.isArray) {
                return {
                    type: "array",
                    items: {
                        type
                    }
                };
            }

            return {
                type: "object",
                additionalProperties: {
                    type
                }
            };
        }

        return {
            type
        };
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