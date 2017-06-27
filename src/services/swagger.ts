import {
    BodyParameter, FormDataParameter, Parameter, Path, PathParameter, QueryParameter, Schema, Spec, Info, Contact,
    ExternalDocs, Security, Tag, BaseParameter
} from "swagger-schema-official";
import * as Fs from "fs";
import * as PathUtils from "path";
import {Service} from "../decorators/service";
import ControllerService from "./controller";
import Controller from "../controllers/controller";
import {Endpoint} from "../controllers/endpoint";
import {deepExtends, getClassName} from "../utils/utils";
import InjectParams from "./inject-params";
import {Inject} from "../decorators/inject";
import {ExpressApplication} from "./express-application";
import {ServerSettingsService} from "./server-settings";
import {inject} from "../testing/inject";
import ParseService from "./parse";
import {type} from "os";

export interface ISwaggerPaths {
    [pathName: string]: Path;
}

export interface ISwaggerSettings {
    path: string;
    cssPath?: string;
    options?: any;
    showExplorer?: boolean;
    specPath?: string;
    spec?: {
        swagger?: string;
        info?: Info;
        externalDocs?: ExternalDocs;
        host?: string;
        basePath?: string;
        schemes?: string[];
        consumes?: string[];
        produces?: string[];
        paths?: { [pathName: string]: Path };
        definitions?: { [definitionsName: string]: Schema };
        parameters?: { [parameterName: string]: BodyParameter | QueryParameter };
        responses?: { [responseName: string]: Response };
        security?: Array<{ [securityDefinitionName: string]: string[] }>;
        securityDefinitions?: { [securityDefinitionName: string]: Security };
        tags?: Tag[];
    };
}

@Service()
export default class SwaggerService {

    MODEL_AUTO_INCREMENT = 1;

    constructor(private controllerService: ControllerService,
                private serverSettingsService: ServerSettingsService,
                private parseService: ParseService,
                @Inject(ExpressApplication) private expressApplication: ExpressApplication) {

    }

    load() {
        const conf = this.serverSettingsService.get<ISwaggerSettings>("swagger");

        if (conf) {
            const swaggerUiMiddleware = require("swagger-ui-express");
            let cssContent;

            if (conf.cssPath) {
                cssContent = Fs.readFileSync(PathUtils.resolve(this.serverSettingsService.resolve(conf.cssPath)));
            }

            this.expressApplication.use(
                conf.path,
                swaggerUiMiddleware.serve,
                swaggerUiMiddleware.setup(this.getOpenAPISpec(), conf.showExplorer, conf.options, cssContent)
            );
        }

        this.expressApplication.get("/swagger.json", (req, res, next) => {
            try {
                const content = this.getOpenAPISpec();
                res.status(200).json(content);

                next();
            } catch (er) {
                console.error(er);
                next(er);
            }
        });
    }

    /**
     *
     * @param out
     * @param args
     * @returns {any}
     */


    /**
     *
     * @returns {Spec}
     */
    public getOpenAPISpec(): Spec {
        const {specPath, spec = {}} = this.serverSettingsService.get<ISwaggerSettings>("swagger");
        const consumes = this.serverSettingsService.acceptMimes;
        const produces = ["application/json"];
        const info = this.getOpenApiInfo();
        let specPathContent = {};
        let paths: ISwaggerPaths = {};
        let definitions = {};

        this.controllerService
            .forEach((finalCtrl: Controller) => {
                if (!finalCtrl.parent) {
                    finalCtrl
                        .getMountEndpoints()
                        .map(endpoint => finalCtrl.getEndpointUrl(endpoint))
                        .forEach(endpoint => this.buildRoutes(paths, definitions, finalCtrl, endpoint));
                }
            });

        if (specPath) {
            specPathContent = require(this.serverSettingsService.resolve(specPath));
        }

        return deepExtends(
            {swagger: "2.0"},
            specPathContent,
            spec,
            {
                info,
                consumes,
                produces,
                paths,
                definitions
            }
        );
    }

    /**
     * Return the global api information.
     * @returns {Info}
     */
    public getOpenApiInfo(): Info {
        const {version} = this.serverSettingsService;
        const {spec} = this.serverSettingsService.get<ISwaggerSettings>("swagger") || {} as any;

        const {
            title = "Api documentation",
            description = "",
            version: versionInfo,
            termsOfService = "",
            contact,
            license
        } = spec.info || {} as any;

        return {
            version: versionInfo || version,
            title,
            description,
            termsOfService,
            contact,
            license
        };
    }

    /**
     *
     * @param expressPath
     * @returns {any}
     */
    public getOpenApiPath = (expressPath: string | RegExp): string | RegExp => {
        if (typeof expressPath === "string") {
            let params = expressPath.match(/:[\w]+/g);

            let OpenAPIPath = expressPath;
            if (params) {
                let swagerParams = params.map(x => {
                    return "{" + x.replace(":", "") + "}";
                });

                OpenAPIPath = params.reduce((acc, el, ix) => {
                    return acc.replace(el, swagerParams[ix]);
                }, expressPath);
            }
            return OpenAPIPath;
        } else {
            return expressPath;
        }
    };
    /**
     *
     * @param injectedParams
     * @param definitions
     * @returns {Parameter[]}
     */
    public getOpenApiParams = (injectedParams: InjectParams[], definitions: { [key: string]: Schema }): Parameter[] => {
        let openAPIParameters: Parameter[] = [];
        let bodySchema: Schema;

        openAPIParameters = <Parameter[]> injectedParams
            .map((param: InjectParams) => {
                const inType = {
                    "parseBody": "body",
                    "parseParams": "path",
                    "parseQuery": "query",
                    "getHeader": "header"
                }[param.name];

                if (inType === undefined) { // not a input paramaters
                    console.log("inType", inType, param.name);
                    return;
                }
                if (inType === "body") {
                    bodySchema = this.createSchema(param);
                } else {
                    const schema = this.mapParam(param);
                    console.log(schema)
                    return {
                        "in": inType,
                        ...schema
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
            bodyParam["$ref"] = `#/definitions/${model}`;
            bodyParam.description = "";
            bodyParam.required = true;
            openAPIParameters.push(bodyParam);

            definitions[model] = bodySchema;

            this.MODEL_AUTO_INCREMENT++;
        }


        return openAPIParameters;
    };

    /**
     *
     * @param param
     * @returns {T&{}}
     */
    private mapParam(param: InjectParams) {
        const {
            required,
            useName,
            expression
        }
            = param;

        return {
            name: expression,
            required,
            description: "",
            type: this.swaggerType(useName)
        };
    }

    /**
     *
     * @param param
     */
    /*mapBopyParam(param: InjectParams) {
     const {required, useName: type} = param;

     const body = {properties: {}};

     if (!schema) {
     bodyParams.schema = {};
     bodyParams.schema.properties = {};
     }
     const property: Schema = {
     type
     };

     this.parseService.eval(ex);

     bodyParams.schema.properties[p.expression] = property;
     if (p.required) {
     if (!bodyParams.schema.required) bodyParams.schema.required = [];
     bodyParams.schema.required.push(p.expression);
     }
     }*/

    /**
     *
     * @param param
     * @returns {Schema}
     */
    private createSchema(param: InjectParams) {
        const {
            required,
            useName,
            baseTypeName,
            expression
        }
            = param;
        const keys = (expression as string).split(".");
        const output: Schema = {
            type: "object",
            properties: {}
        };
        let current = output;

        keys.forEach((key, index) => {
            current[key] = <Schema> {};

            if (index < keys.length - 1) {
                current.properties = {};
                current = current[key].properties;
            }
        });

        if (baseTypeName === "Array") {
            Object.assign(current, {
                type: "array",
                items: {
                    type: this.swaggerType(useName)
                }
            });
        } else {
            Object.assign(current, {
                type: this.swaggerType(useName)
            });
        }

        Object.assign(current, {
            required
        });

        return output;
    }

    swaggerType(type: string): string {
        if (["Array", "Boolean", "Object", "Number", "String"].indexOf(type) > -1) {
            return type.toLowerCase();
        }

        // in type case the type is complexe
        return type;
    }

    /**
     *
     * @param paths
     * @param definitions
     * @param ctrl
     * @param endpointUrl
     */
    public buildRoutes = (paths: ISwaggerPaths, definitions: { [key: string]: Schema }, ctrl: Controller, endpointUrl: string) => {

        ctrl.dependencies
            .forEach((ctrl: Controller) => this.buildRoutes(paths, definitions, ctrl, `${endpointUrl}${ctrl.endpointUrl}`));

        ctrl.endpoints.forEach((endpoint: Endpoint) => {

            if (endpoint.hasMethod()) {

                // get Api Info collected by decorators
                const {produces = [], consumes = []} = endpoint.getApiInfo();

                const className = getClassName(ctrl.targetClass),
                    parameters = this.getOpenApiParams(
                        InjectParams.getParams(ctrl.targetClass, endpoint.methodClassName),
                        definitions
                    );

                const OpenAPIPath = `${endpointUrl}${this.getOpenApiPath(endpoint.getRoute()) || ""}`;

                if (!paths[OpenAPIPath]) paths[OpenAPIPath] = {};

                paths[OpenAPIPath][endpoint.getMethod()] = {
                    operationId: endpoint.methodClassName,
                    tags: [className],
                    parameters,
                    consumes,
                    responses: {"200": {description: ""}},
                    produces
                };

            }
        });

    };

}