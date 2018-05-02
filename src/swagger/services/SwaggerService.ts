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

const swaggerUiPath = require("swagger-ui-dist").absolutePath();
const ejs = require("ejs");

@Service()
export class SwaggerService {
    private OPERATION_IDS: any = {};

    constructor(private controllerService: ControllerService,
                private serverSettingsService: ServerSettingsService,
                @ExpressApplication private expressApplication: Express.Application) {

    }

    /**
     *
     */
    $afterRoutesInit() {
        const host = this.serverSettingsService.getHttpPort();
        const swagger: ISwaggerSettings[] = [].concat(this.serverSettingsService.get("swagger")).filter(o => !!o);

        const urls: any[] = swagger.reduce((acc: any[], conf) => {
            const {path = "/", doc, hidden} = conf;
            if (!hidden) {
                acc.push({url: `${path}/swagger.json`, name: doc || path});
            }
            return acc;
        }, []);


        swagger
            .forEach((conf: ISwaggerSettings) => {
                const {path = "/", doc, options = {}, outFile, showExplorer, cssPath, jsPath} = conf;
                const spec = this.getOpenAPISpec(conf);
                const scope = {
                    spec,
                    url: `${path}/swagger.json`,
                    urls,
                    showExplorer,
                    cssPath,
                    jsPath,
                    swaggerOptions: options
                };

                this.expressApplication.get(path, this.middlewareRedirect(path));
                this.expressApplication.use(path, this.createRouter(conf, scope));
                if (outFile) {
                    Fs.writeFileSync(outFile, JSON.stringify(spec, null, 2));
                }

                $log.info(`[${doc || "default"}] Swagger JSON is available on http://${host.address}:${host.port}${path}/swagger.json`);
                $log.info(`[${doc || "default"}] Swagger UI is available on http://${host.address}:${host.port}${path}`);
            });
    }

    /**
     *
     * @param {ISwaggerSettings} conf
     * @param scope
     */
    private createRouter(conf: ISwaggerSettings, scope: any) {
        const {cssPath, jsPath} = conf;
        const router = Express.Router();

        router.get("/", this.middlewareIndex(scope));
        router.get("/swagger.json", (req: any, res: any) => res.status(200).json(scope.spec));
        router.use(Express.static(swaggerUiPath));

        if (cssPath) {
            router.get("/main.css", this.middlewareCss(cssPath));
        }

        if (jsPath) {
            router.get("/main.js", this.middlewareJs(jsPath));
        }

        return router;
    }

    private middlewareRedirect(path: string) {
        /* istanbul ignore next */
        return (req: any, res: any, next: any) => {
            if (req.url === path && !req.url.match(/\/$/)) {
                res.redirect(path + "/");
            } else {
                next();
            }
        };
    }

    /**
     *
     * @param scope
     * @returns {(req: any, res: any) => any}
     */
    private middlewareIndex(scope: any) {
        /* istanbul ignore next */
        return (req: any, res: any) =>
            ejs.renderFile(__dirname + "/../views/index.ejs", scope, {}, (err: any, str: string) => {
                if (err) {
                    $log.error(err);
                    res.status(500).send(err.message);
                } else {
                    res.send(str);
                }
            });

    }

    /**
     *
     * @param {e.Router} router
     * @param {string} path
     */
    private middlewareCss(path: string) {
        /* istanbul ignore next */
        return (req: any, res: any) => {
            const content = Fs.readFileSync(PathUtils.resolve(this.serverSettingsService.resolve(path)), {encoding: "utf8"});
            res.set("Content-Type", "text/css");
            res.status(200).send(content);
        };
    }

    /**
     *
     * @param {e.Router} router
     * @param {string} path
     */
    private middlewareJs(path: string) {
        /* istanbul ignore next */
        return (req: any, res: any) => {
            const content = Fs.readFileSync(PathUtils.resolve(this.serverSettingsService.resolve(path)), {encoding: "utf8"});
            res.set("Content-Type", "application/javascript");
            res.status(200).send(content);
        };
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