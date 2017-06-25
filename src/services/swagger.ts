import {
    BodyParameter, FormDataParameter, Parameter, Path, PathParameter, QueryParameter, Schema, Spec
} from "swagger-schema-official";
import {Service} from "../decorators/service";
import ControllerService from "./controller";
import Controller from "../controllers/controller";
import {Endpoint} from "../controllers/endpoint";
import {getClassName} from "../utils/utils";
import InjectParams from "./inject-params";
import Metadata from "./metadata";
import {Inject} from "../decorators/inject";
import {ExpressApplication} from "./express-application";
import {ServerSettingsService} from "./server-settings";

export interface SwaggerPaths {
    [pathName: string]: Path;
}

export interface SwaggerSettings {
    path: string;
    setup?: any;
}

@Service()
export default class SwaggerService {

    constructor(private controllerService: ControllerService,
                private serverSettingsService: ServerSettingsService,
                @Inject(ExpressApplication) private expressApplication: ExpressApplication) {

    }

    load() {
        const conf = this.serverSettingsService.get<SwaggerSettings>("swagger");

        if (conf) {
            const swaggerUiMiddleware = require("swagger-ui-express");

            this.expressApplication.use(
                conf.path,
                swaggerUiMiddleware.serve,
                swaggerUiMiddleware.setup(conf || {})
            );
        }

        this.expressApplication.get("/swagger.json", (req, res, next) => {
            const content = this.getOpenAPISpec();
            res.status(200).json(content);
            next();
        });
    }

    public getOpenAPISpec(): Spec {

        let openAPI: Spec = {
            "swagger": "2.0",
            "info": {
                "version": "1.0.0",
                "title": "Swagger",
            },
            "paths": {}
        };

        let paths: SwaggerPaths = {};

        this.controllerService
            .forEach((finalCtrl: Controller) => {

                if (!finalCtrl.parent) {
                    finalCtrl
                        .getMountEndpoints()
                        .map(endpoint => finalCtrl.getEndpointUrl(endpoint))
                        .forEach(endpoint => this.buildRoutes(paths, finalCtrl, endpoint));
                }


            });

        openAPI.paths = paths;
        return openAPI;
    }

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

    public getOpenApiParams = (tsDecoratorsParams: any): Parameter[] => {
        let OpenAPIParameters: Parameter[] = [];

        let bodyParams: BodyParameter = {in: "", name: ""};

        let notBodyParams: PathParameter | QueryParameter | FormDataParameter;
        notBodyParams = {type: "", name: "", required: false, in: ""};

        let hasBodyParams = false;
        tsDecoratorsParams.forEach(p => {
            switch (p.name) {
                case "parseParams":
                    notBodyParams.in = "path";
                    notBodyParams.required = true;
                    notBodyParams.type = p.use ? p.use.name.toLowerCase() : "";
                    break;
                case "parseBody":
                    hasBodyParams = true;
                    if (!bodyParams.schema) {
                        bodyParams.schema = {};
                        bodyParams.schema.properties = {};
                    }
                    let property: Schema = {
                        type: p.use ? p.use.name.toLowerCase() : ""
                    };
                    bodyParams.schema.properties[p.expression] = property;
                    if (p.required) {
                        if (!bodyParams.schema.required) bodyParams.schema.required = [];
                        bodyParams.schema.required.push(p.expression);
                    }
                    break;
                default:
                    notBodyParams["in"] = "path";
                    notBodyParams["type"] = p.use ? p.use.name.toLowerCase() : "";
            }
            notBodyParams.name = p.expression;
            if (p.name !== "parseBody" && p.expression) {
                if (p.required) notBodyParams["required"] = true;
                OpenAPIParameters.push(notBodyParams);
            }
        });

        if (hasBodyParams) {
            bodyParams.in = "body";
            bodyParams.name = "bodyParam";
            bodyParams.schema.type = "object";
            OpenAPIParameters.push(bodyParams);
        }
        return OpenAPIParameters;
    };

    /**
     *
     * @param paths
     * @param ctrl
     * @param endpointUrl
     */
    public buildRoutes = (paths: SwaggerPaths, ctrl: Controller, endpointUrl: string) => {

        ctrl.dependencies
            .forEach((ctrl: Controller) => this.buildRoutes(paths, ctrl, `${endpointUrl}${ctrl.endpointUrl}`));

        ctrl.endpoints.forEach((endpoint: Endpoint) => {

            if (endpoint.hasMethod()) {

                const className = getClassName(ctrl.targetClass),
                    parameters = InjectParams.getParams(ctrl.targetClass, endpoint.methodClassName),
                    returnContentType = Metadata.getReturnContentType(ctrl.targetClass, endpoint.methodClassName);


                let OpenAPIPath = `${endpointUrl}${this.getOpenApiPath(endpoint.getRoute()) || ""}`;

                if (!paths[OpenAPIPath]) paths[OpenAPIPath] = {};

                paths[OpenAPIPath][endpoint.getMethod()] = {
                    operationId: endpoint.methodClassName,
                    tags: [className],
                    parameters: this.getOpenApiParams(parameters),
                    consumes: [],
                    responses: {"200": {description: ""}},
                    produces: returnContentType ? [returnContentType] : []
                };

            }
        });

    };

}