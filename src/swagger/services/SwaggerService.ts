import {
    ControllerProvider,
    ControllerService,
    EndpointMetadata,
    ExpressApplication,
    ServerSettingsService,
    Service
} from "@tsed/common";
import {deepExtends, nameOf, Store} from "@tsed/core";
import * as Express from "express";
import * as Fs from "fs";
import * as PathUtils from "path";
import {Info, Schema, Spec, Tag} from "swagger-schema-official";
import {$log} from "ts-log-debug";
import {OpenApiEndpointBuilder} from "../class/OpenApiEndpointBuilder";
import {ISwaggerPaths, ISwaggerSettings} from "../interfaces";
import {getReducers} from "../utils";

@Service()
export class SwaggerService {
    private OPERATION_IDS: any = {};

    constructor(private controllerService: ControllerService,
                private serverSettingsService: ServerSettingsService,
                @ExpressApplication private expressApplication: Express.Application) {

    }

    /**
     *
     * @returns {any}
     */
    private middleware() {
        return require("swagger-ui-express");
    }

    /**
     *
     * @param {string} path
     * @param host
     * @param options
     * @returns {(req: any, res: any, next: any) => void}
     */
    private buildSwaggerOptions(path: string, host: any, options: any) {
        const swaggerInitPath = require.resolve("swagger-ui-express/swagger-ui-init.js");
        const swaggerInitJS = Fs.readFileSync(swaggerInitPath, {encoding: "utf8"});

        return (req: any, res: any, next: any) => {

            if (req.url === "/swagger-ui-init.js") {
                res.set("Content-Type", "application/javascript");

                const json = JSON.stringify({
                    customOptions: options || {},
                    swaggerUrl: `${req.protocol}://${host.address}:${host.port}${path}/swagger.json`
                });

                const content = swaggerInitJS.toString().replace(
                    "<% swaggerOptions %>",
                    "var options = " + json
                );

                res.send(content);
            } else {
                next();
            }
        };
    }

    /**
     *
     */
    $afterRoutesInit() {
        const host = this.serverSettingsService.getHttpPort();

        []
            .concat(this.serverSettingsService.get("swagger"))
            .filter(o => !!o)
            .forEach((conf: ISwaggerSettings) => {
                const {path = "/", doc, options = {}, outFile, showExplorer} = conf;
                const spec = this.getOpenAPISpec(conf);
                const router = Express.Router();

                let customCss;

                if (conf.cssPath) {
                    customCss = Fs.readFileSync(PathUtils.resolve(this.serverSettingsService.resolve(conf.cssPath)), {encoding: "utf8"});
                }

                router.get("/swagger.json", (req: any, res: any) => res.status(200).json(spec));

                $log.info(`[${doc || "default"}] Swagger JSON is available on http://${host.address}:${host.port}${path}/swagger.json`);
                $log.info(`[${doc || "default"}] Swagger UI is available on http://${host.address}:${host.port}${path}`);

                router.use(this.buildSwaggerOptions(path, host, options));
                router.use(this.middleware().serve);
                router.get("/", this.middleware().setup(null, {
                    swaggerOptions: options,
                    explorer: showExplorer,
                    customCss
                }));

                if (outFile) {
                    Fs.writeFileSync(outFile, JSON.stringify(spec, null, 2));
                }

                this.expressApplication.use(path, router);
            });
    }

    /**
     *
     * @returns {Spec}
     */
    public getOpenAPISpec(conf: ISwaggerSettings): Spec {
        const defaultSpec = this.getDefaultSpec(conf);
        const paths: ISwaggerPaths = {};
        const definitions = {};
        const doc = conf.doc;
        let tags: Tag[] = [];

        this.controllerService.routes.forEach(({provider, route}) => {
            const hidden = provider.store.get("hidden");
            const docs = provider.store.get("docs") || [];

            if (!doc && !hidden || doc && docs.indexOf(doc) > -1) {
                this.buildRoutes(paths, definitions, provider, route);
                tags.push(this.buildTags(provider));
            }
        });

        return deepExtends(
            defaultSpec,
            {
                tags,
                paths,
                definitions
            },
            getReducers()
        );
    }

    private readSpecPath(path: string) {
        path = this.serverSettingsService.resolve(path);
        if (Fs.existsSync(path)) {
            const json = Fs.readFileSync(path, {encoding: "utf8"});
            /* istanbul ignore else */
            if (json !== "") {
                return JSON.parse(json);
            }
        }
        return {};
    }

    /**
     * Return the global api information.
     * @returns {Info}
     */
    public getDefaultSpec(conf: ISwaggerSettings): Spec {
        const {version} = this.serverSettingsService;
        const consumes = this.serverSettingsService.acceptMimes;
        const produces = ["application/json"];
        const {
            spec = {
                info: {},
                securityDefinitions: {}
            }, specPath
        } = conf || {} as any;
        let specPathContent = {};

        if (specPath) {
            specPathContent = this.readSpecPath(specPath);
        }

        /* istanbul ignore next */
        const {
            title = "Api documentation",
            description = "",
            version: versionInfo,
            termsOfService = "",
            contact,
            license
        } = spec.info || {} as any;

        return deepExtends({
                swagger: "2.0",
                info: {
                    version: versionInfo || version,
                    title,
                    description,
                    termsOfService,
                    contact,
                    license
                },
                consumes,
                produces,
                securityDefinitions: spec.securityDefinitions || {}
            },
            specPathContent,
            getReducers()
        );
    }

    /**
     *
     * @param paths
     * @param definitions
     * @param ctrl
     * @param endpointUrl
     */
    private buildRoutes(paths: ISwaggerPaths, definitions: { [key: string]: Schema }, ctrl: ControllerProvider, endpointUrl: string) {

        ctrl.dependencies
            .map(ctrl => this.controllerService.get(ctrl))
            .forEach((provider: ControllerProvider) => {
                if (!provider.store.get("hidden")) {
                    this.buildRoutes(paths, definitions, provider, `${endpointUrl}${provider.path}`);
                }
            });

        ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {
            if (endpoint.store.get("hidden")) {
                return;
            }

            endpoint.pathsMethods.forEach((pathMethod) => {
                /* istanbul ignore else */
                if (!!pathMethod.method) {
                    const builder = new OpenApiEndpointBuilder(endpoint, endpointUrl, pathMethod, this.getOperationId)
                        .build();

                    deepExtends(paths, builder.paths);
                    deepExtends(definitions, builder.definitions);
                }
            });
        });
    }

    private buildTags(ctrl: ControllerProvider): Tag {
        const clazz = ctrl.useClass;
        const ctrlStore = Store.from(clazz);

        return Object.assign(
            {
                name: ctrlStore.get("name") || nameOf(clazz),
                description: ctrlStore.get("description")
            },
            ctrlStore.get("tag") || {}
        );
    }

    private getOperationId = (operationId: string) => {
        if (this.OPERATION_IDS[operationId] !== undefined) {
            this.OPERATION_IDS[operationId]++;
            operationId = operationId + "_" + this.OPERATION_IDS[operationId];
        } else {
            this.OPERATION_IDS[operationId] = 0;
        }
        return operationId;
    };
}