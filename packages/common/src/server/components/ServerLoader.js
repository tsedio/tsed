"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@tsed/core");
const mvc_1 = require("../../mvc");
const GlobalErrorHandlerMiddleware_1 = require("../components/GlobalErrorHandlerMiddleware");
const LogIncomingRequestMiddleware_1 = require("../components/LogIncomingRequestMiddleware");
const expressApplication_1 = require("../decorators/expressApplication");
const httpServer_1 = require("../decorators/httpServer");
const httpsServer_1 = require("../decorators/httpsServer");
const ServeStaticService_1 = require("../services/ServeStaticService");
const callHook_1 = require("../utils/callHook");
const contextMiddleware_1 = require("../utils/contextMiddleware");
const createContainer_1 = require("../utils/createContainer");
const createExpressApplication_1 = require("../utils/createExpressApplication");
const createHttpServer_1 = require("../utils/createHttpServer");
const createHttpsServer_1 = require("../utils/createHttpsServer");
const createInjector_1 = require("../utils/createInjector");
const getConfiguration_1 = require("../utils/getConfiguration");
const listenServer_1 = require("../utils/listenServer");
const loadInjector_1 = require("../utils/loadInjector");
const printRoutes_1 = require("../utils/printRoutes");
const resolveProviders_1 = require("../utils/resolveProviders");
const setLoggerLevel_1 = require("../utils/setLoggerLevel");
/**
 * ServerLoader provider all method to instantiate an ExpressServer.
 *
 * It provide some features :
 *
 * * [Lifecycle hooks](/docs/server-loader.md#lifecycle-hooks),
 * * Middleware importation,
 * * Scan directory. You can specify controllers and services directory in your project,
 *
 * ```typescript
 * // In server.ts
 * import {ServerLoader, ServerSettings} from "@tsed/common";
 * import Path = require("path");
 * @ServerSettings({
 *    rootDir: Path.resolve(__dirname),
 *    port: 8000,
 *    httpsPort: 8080,
 *    mount: {
 *      "/rest": "${rootDir}/controllers/**\/*.js"
 *    }
 * })
 * export class Server extends ServerLoader {
 *
 *     $onReady(){
 *         console.log('Server started...');
 *     }
 *
 *     $onServerInitError(err){
 *         console.error(err);
 *     }
 * }
 *
 * // In app.ts
 * import Server from "./server";
 * new Server()
 *     .start()
 *     .then(() => console.log('started'))
 *     .catch(er => console.error(er));
 *
 * ```
 *
 */
class ServerLoader {
    /**
     *
     */
    constructor(settings = {}) {
        this.version = "0.0.0-PLACEHOLDER";
        this.routes = [];
        this.startedAt = new Date();
        // create injector with initial configuration
        this.injector = createInjector_1.createInjector(getConfiguration_1.getConfiguration(this, settings));
        createExpressApplication_1.createExpressApplication(this.injector);
        createHttpsServer_1.createHttpsServer(this.injector);
        createHttpServer_1.createHttpServer(this.injector);
    }
    /**
     * Return the settings configured by the decorator @@ServerSettings@@.
     *
     * ```typescript
     * @ServerSettings({
     *    rootDir: Path.resolve(__dirname),
     *    port: 8000,
     *    httpsPort: 8080,
     *    mount: {
     *      "/rest": "${rootDir}/controllers/**\/*.js"
     *    }
     * })
     * export class Server extends ServerLoader {
     *     $onInit(){
     *         console.log(this.settings); // {rootDir, port, httpsPort,...}
     *     }
     * }
     * ```
     *
     * @returns {ServerSettingsService}
     */
    get settings() {
        return this.injector.settings;
    }
    /**
     * Return Express Application instance.
     * @returns {core.Express}
     */
    get expressApp() {
        return this.injector.get(expressApplication_1.ExpressApplication);
    }
    /**
     * Return the InjectorService initialized by the server.
     * @returns {InjectorService}
     * @deprecated
     */
    get injectorService() {
        return this.injector;
    }
    /**
     * Return Http.Server instance.
     * @returns {Http.Server}
     */
    get httpServer() {
        return this.injector.get(httpServer_1.HttpServer);
    }
    /**
     * Return Https.Server instance.
     * @returns {Https.Server}
     */
    get httpsServer() {
        return this.injector.get(httpsServer_1.HttpsServer);
    }
    static bootstrap(module, settings = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const server = new module(settings);
            yield server.runLifecycle();
            return server;
        });
    }
    /**
     * Create a new HTTP server with the provided `port`.
     * @returns {ServerLoader}
     * @deprecated
     */
    // istanbul ignore next
    createHttpServer(port) {
        this.settings.httpPort = port;
        return this;
    }
    /**
     * Create a new HTTPs server.
     *
     * `options` @@IHTTPSServerOptions@@:
     *
     * key | type | Description
     * ---|---|---
     * port | number | Port number
     * key | string, [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer), Object | The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
     * passphrase | string | A string containing the passphrase for the private key or pfx.
     * cert | string, [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) | A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
     * ca | string, [Buffer](https://nodejs.org/api/buffer.html#buffer_class_buffer) | A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.
     *
     * See more info on [httpsOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
     *
     * @param options Options to create new HTTPS server.
     * @returns {ServerLoader}
     * @deprecated
     */
    // istanbul ignore next
    createHttpsServer(options) {
        this.settings.httpsPort = options.port;
        return this;
    }
    /**
     * This method let you to add a express middleware or a Ts.ED middleware like GlobalAcceptMimes.
     *
     * ```typescript
     * @ServerSettings({
     *    rootDir,
     *    acceptMimes: ['application/json'] // optional
     * })
     * export class Server extends ServerLoader {
     *     $beforeRoutesInit(): void|Promise<any> {
     *         const methodOverride = require('method-override');
     *
     *         this.use(GlobalAcceptMimesMiddleware)
     *             .use(methodOverride());
     *
     *         // similar to
     *         this.expressApp.use(methodOverride());
     *
     *         // but not similar to
     *         this.expressApp.use(GlobalAcceptMimesMiddleware); // in this case, this middleware will not be added correctly to express.
     *
     *         return null;
     *     }
     * }
     * ```
     * @param args
     * @returns {ServerLoader}
     */
    use(...args) {
        this.expressApp.use(...args);
        return this;
    }
    /**
     * Proxy to express set
     * @param setting
     * @param val
     * @returns {ServerLoader}
     */
    set(setting, val) {
        this.expressApp.set(setting, val);
        return this;
    }
    /**
     * Proxy to express engine
     * @param ext
     * @param fn
     * @returns {ServerLoader}
     */
    engine(ext, fn) {
        this.expressApp.engine(ext, fn);
        return this;
    }
    /**
     * Start the express server.
     * @returns {Promise<any>|Promise}
     */
    start() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.runLifecycle();
                yield this.listen();
            }
            catch (err) {
                this.callHook("$onServerInitError", undefined, err);
                return Promise.reject(err);
            }
        });
    }
    runLifecycle() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.loadSettingsAndInjector();
            yield this.loadMiddlewares();
        });
    }
    listen() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.callHook("$beforeListen");
            yield this.startServers();
            yield this.callHook("$afterListen");
            yield this.ready();
            this.injector.logger.info(`Started in ${new Date().getTime() - this.startedAt.getTime()} ms`);
        });
    }
    ready() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.callHook("$onReady");
            yield this.injector.emit("$onServerReady");
        });
    }
    /**
     * Scan and imports all files matching the pattern. See the document on the [Glob](https://www.npmjs.com/package/glob)
     * pattern for more information.
     *
     * #### Example
     *
     * ```typescript
     * import {ServerLoader} from "@tsed/common";
     * import Path = require("path");
     *
     * export class Server extends ServerLoader {
     *
     *    constructor() {
     *        super();
     *
     *        let appPath = Path.resolve(__dirname);
     *
     *        this.scan(appPath + "/controllers/**\/**.js")
     *   }
     * }
     * ```
     *
     * Theses pattern scan all files in the directories controllers, services recursively.
     *
     * > On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.
     *
     * ```typescript
     * const controllerPattern = Path.join(rootDir, 'controllers','**','*.js');
     * ```
     *
     * @param patterns
     * @param endpoint
     * @returns {ServerLoader}
     */
    scan(patterns, endpoint) {
        if (endpoint) {
            this.addControllers(endpoint, [].concat(patterns));
        }
        else {
            this.addComponents([].concat(patterns));
        }
        return this;
    }
    /**
     * Add classes to the components list
     * @param classes
     * @param options
     */
    addComponents(classes, options = {}) {
        this.injector.settings.componentsScan = this.injector.settings.componentsScan.concat(classes);
        return this;
    }
    /**
     * Add classes decorated by @@Controller()@@ to components container.
     *
     * ### Example
     *
     * ```typescript
     * @Controller('/ctrl')
     * class MyController{
     * }
     *
     * new ServerLoader().addControllers('/rest', [MyController])
     * ```
     *
     * ::: tip
     * If the MyController class isn't decorated, the class will be ignored.
     * :::
     *
     * @param {string} endpoint
     * @param {any[]} controllers
     * @returns {ServerLoader}
     */
    addControllers(endpoint, controllers) {
        this.settings.mount[endpoint] = (this.settings.mount[endpoint] || []).concat(controllers);
    }
    /**
     * Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob))
     * under the endpoint.
     *
     * ::: tip
     * See [Versioning Rest API](/docs/controllers.md#routing) for more information.
     * :::
     *
     * @param endpoint
     * @param list
     * @returns {ServerLoader}
     * @deprecated use ServerLoader.addControllers instead
     */
    mount(endpoint, list) {
        this.addControllers(endpoint, list);
        return this;
    }
    callHook(key, ...args) {
        return callHook_1.callHook(this.injector, this, key, ...args);
    }
    /**
     *
     * @returns {Promise<void>}
     */
    loadSettingsAndInjector() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            setLoggerLevel_1.setLoggerLevel(this.injector);
            this.injector.logger.debug("Scan components");
            yield this.resolveProviders();
            yield this.callHook("$beforeInit");
            yield this.callHook("$onInit");
            this.injector.logger.info("Build providers");
            yield loadInjector_1.loadInjector(this.injector, createContainer_1.createContainer(this));
            this.injector.logger.debug("Settings and injector loaded");
            yield this.callHook("$afterInit");
        });
    }
    /**
     * Initialize configuration of the express app.
     */
    loadMiddlewares() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.injector.logger.debug("Mount middlewares");
            this.use(contextMiddleware_1.contextMiddleware(this.injector));
            this.settings.logger.level !== "off" && this.use(LogIncomingRequestMiddleware_1.LogIncomingRequestMiddleware); // FIXME will be deprecated
            yield this.callHook("$onMountingMiddlewares");
            yield this.callHook("$beforeRoutesInit"); // deprecated
            this.injector.logger.info("Load routes");
            const routeService = this.injector.get(mvc_1.RouteService);
            routeService.addRoutes(this.routes);
            yield this.callHook("$onRoutesInit");
            const staticsService = this.injector.get(ServeStaticService_1.ServeStaticService);
            staticsService.statics(this.injector.settings.statics);
            yield this.callHook("$afterRoutesInit");
            // Import the globalErrorHandler
            this.use(GlobalErrorHandlerMiddleware_1.GlobalErrorHandlerMiddleware);
            if (!this.settings.logger.disableRoutesSummary) {
                this.injector.logger.info("Routes mounted :");
                this.injector.logger.info(printRoutes_1.printRoutes(routeService.getRoutes()));
            }
        });
    }
    resolveProviders() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const providers = yield resolveProviders_1.resolveProviders(this.injector);
            this.routes = providers.filter(provider => !!provider.route).map(({ route, token }) => ({ route, token }));
        });
    }
    /**
     * Create a new server from settings parameters.
     * @param http
     * @param settings
     * @returns {Promise<TResult2|TResult1>}
     */
    startServer(http, settings) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.injector.logger.debug(`Start server on ${settings.https ? "https" : "http"}://${settings.address}:${settings.port}`);
            const resolvedSettings = yield listenServer_1.listenServer(http, settings);
            this.injector.logger.info(`Listen server on ${settings.https ? "https" : "http"}://${settings.address}:${settings.port}`);
            return resolvedSettings;
        });
    }
    /* istanbul ignore next */
    setSettings(settings) {
        this.settings.set(settings);
        /* istanbul ignore next */
        if (this.settings.env === "test") {
            this.injector.logger.stop();
        }
    }
    /**
     * Initialize all servers.
     * @returns {Promise<any>}
     */
    startServers() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const promises = [];
            /* istanbul ignore else */
            if (this.settings.httpPort !== false) {
                const settings = this.settings.getHttpPort();
                promises.push(this.startServer(this.httpServer, Object.assign({ https: false }, settings)).then(settings => {
                    this.settings.setHttpPort(settings);
                }));
            }
            /* istanbul ignore else */
            if (this.settings.httpsPort !== false) {
                const settings = this.settings.getHttpsPort();
                promises.push(this.startServer(this.httpsServer, Object.assign({ https: true }, settings)).then(settings => {
                    this.settings.setHttpsPort(settings);
                }));
            }
            return Promise.all(promises);
        });
    }
}
tslib_1.__decorate([
    core_1.Deprecated("Use ServerLoader.addControllers git instead"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", ServerLoader)
], ServerLoader.prototype, "mount", null);
exports.ServerLoader = ServerLoader;
//# sourceMappingURL=ServerLoader.js.map