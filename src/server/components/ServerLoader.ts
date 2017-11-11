/**
 * @module common/server
 */
/** */
import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import * as Path from "path";
import {$log} from "ts-log-debug";
import {ServerSettingsProvider} from "../../config";
import {IServerSettings} from "../../config/interfaces/IServerSettings";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Deprecated, ExpressApplication} from "../../core";
import {HttpServer} from "../../core/services/HttpServer";
import {HttpsServer} from "../../core/services/HttpsServer";
import {InjectorService} from "../../di";

import {GlobalErrorHandlerMiddleware} from "../../mvc";
import {HandlerBuilder} from "../../mvc/class/HandlerBuilder";
import {LogIncomingRequestMiddleware} from "../../mvc/components/LogIncomingRequestMiddleware";
import {IComponentScanned, IHTTPSServerOptions, IServerLifecycle} from "../interfaces";

/**
 * ServerLoader provider all method to instantiate an ExpressServer.
 *
 * It provide some features :
 *
 * * [Lifecycle hooks](docs/server-loader/lifecycle-hooks.md),
 * * [Versioning Api](docs/server-loader/versioning.md),
 * * [Authentication strategy](docs/server-loader/authentication.md).
 * * [Global errors handler](docs/server-loader/global-error-handler.md),
 * * Middleware importation,
 * * Scan directory. You can specify controllers and services directory in your project,
 *
 * ```typescript
 * // In server.ts
 * import {ServerLoader, ServerSettings} from "ts-express-decorators";
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
$log.name = "TSED";
$log.level = "info";

export abstract class ServerLoader implements IServerLifecycle {
    public version: string = require("../../../package.json").version;
    private _expressApp: Express.Application = Express();
    private _settings: ServerSettingsProvider;
    private _components: IComponentScanned[] = [];
    private _httpServer: Http.Server;
    private _httpsServer: Https.Server;
    private _injectorService: InjectorService;

    /**
     *
     */
    constructor() {

        this._settings = InjectorService.get<ServerSettingsProvider>(ServerSettingsService);
        this._settings.authentification = (<any>this).$onAuth || this._settings.authentification;

        // Configure the ExpressApplication factory.
        InjectorService.factory(ExpressApplication, this.expressApp);
        InjectorService.factory(HttpServer, {get: () => this.httpServer});
        InjectorService.factory(HttpsServer, {get: () => this.httpsServer});

        const settings = ServerSettingsProvider.getMetadata(this);

        if (settings) {
            $log.debug("Autoload configuration from metadata");
            this.setSettings(settings);
        }
    }

    /**
     * Create a new HTTP server with the provided `port`.
     * @returns {ServerLoader}
     */
    public createHttpServer(port: string | number): ServerLoader {
        this._httpServer = Http.createServer(<any> this._expressApp);
        this._settings.httpPort = port;
        return this;
    }

    /**
     * Create a new HTTPs server.
     *
     * `options` <IHTTPSServerOptions>:
     *
     * - `port` &lt;number&gt;: Port number,
     * - `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
     * - `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
     * - `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
     * - `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.
     *
     * See more info on [httpsOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener).
     *
     * @param options Options to create new HTTPS server.
     * @returns {ServerLoader}
     */
    public createHttpsServer(options: IHTTPSServerOptions): ServerLoader {
        this._httpsServer = Https.createServer(options, this._expressApp);
        this._settings.httpsPort = options.port;
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
     *     $onMountingMiddlewares(): void|Promise<any> {
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
    public use(...args: any[]): ServerLoader {

        args = args.map((arg) => {

            if (typeof arg === "function") {
                arg = HandlerBuilder.from(arg).build();
            }

            return arg;
        });

        this.expressApp.use(...args);

        return this;
    }

    /**
     * Proxy to express set
     * @param setting
     * @param val
     * @returns {ServerLoader}
     */
    public set(setting: string, val: any): ServerLoader {

        this.expressApp.set(setting, val);

        return this;
    }

    /**
     * Proxy to express engine
     * @param ext
     * @param fn
     * @returns {ServerLoader}
     */
    public engine(ext: string, fn: Function): ServerLoader {

        this.expressApp.engine(ext, fn);

        return this;
    }

    /**
     *
     * @returns {Promise<void>}
     */
    protected async loadSettingsAndInjector() {

        $log.debug("Initialize settings");

        this.getSettingsService()
            .forEach((value, key) => {
                $log.info(`settings.${key} =>`, value);
            });

        $log.info("Build services");
        this._injectorService = InjectorService.get<InjectorService>(InjectorService);
        return this.injectorService.load();
    }

    private callHook = (key: string, elseFn = new Function, ...args: any[]) => {
        const self: any = this;

        if (key in this) {
            $log.debug(`Call hook ${key}()`);
            return self[key](...args);
        }

        return elseFn();
    };

    /**
     *
     */
    protected getSettingsService(): ServerSettingsService {
        return this._settings.$get();
    }

    /**
     *
     * @param key
     */
    private hasHook = (key: string) => !!(this as any)[key];

    /**
     * Start the express server.
     * @returns {Promise<any>|Promise}
     */
    public async start(): Promise<any> {
        const start = new Date();
        try {

            const debug = this.settings.get("debug");

            /* istanbul ignore next */
            if (debug && this.settings.env !== "test") {
                $log.level = "debug";
            }

            await this.callHook("$onInit");
            await this.loadSettingsAndInjector();
            await this.loadMiddlewares();
            await this.startServers();
            await this.callHook("$onReady");

            await this.injectorService.emit("$onServerReady");

            $log.info(`Started in ${new Date().getTime() - start.getTime()} ms`);

        } catch (err) {
            this.callHook("$onServerInitError", () => {
                $log.error("HTTP Server error", err);
            }, err);

            return Promise.reject(err);
        }
    }

    /**
     * Create a new server from settings parameters.
     * @param http
     * @param settings
     * @returns {Promise<TResult2|TResult1>}
     */
    protected startServer(http: any, settings: { https: boolean, address: string | number, port: number }) {
        const {address, port, https} = settings;

        $log.debug(`Start server on ${https ? "https" : "http"}://${settings.address}:${settings.port}`);
        const promise = new Promise((resolve, reject) => {
            http
                .on("listening", resolve)
                .on("error", reject);
        })
            .then(() => {
                $log.info(`HTTP Server listen on ${https ? "https" : "http"}://${settings.address}:${settings.port}`);
            });

        http.listen(port, address);
        return promise;
    }

    /**
     * Initiliaze all servers.
     * @returns {Bluebird<U>}
     */
    private async startServers(): Promise<any> {
        const promises: Promise<any>[] = [];

        /* istanbul ignore else */
        if (this.settings.httpPort) {
            const settings = this._settings.getHttpPort();
            promises.push(this.startServer(
                this.httpServer,
                {https: false, ...settings}
            ));
        }

        /* istanbul ignore else */
        if (this.settings.httpsPort) {
            const settings = this._settings.getHttpsPort();
            promises.push(this.startServer(
                this.httpsServer,
                {https: true, ...settings}
            ));
        }

        return Promise.all<any>(promises);
    }

    /**
     * Set the port for http server.
     * @deprected
     * @param port
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setHttpPort() is deprecated. Use ServerLoader.settings.port instead of.")
    /* istanbul ignore next */
    public setHttpPort(port: number | string): ServerLoader {

        this._settings.httpPort = port;

        return this;
    }

    /**
     * Set the port for https server.
     * @deprecated
     * @param port
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setHttpsPort() is deprecated. Use ServerLoader.settings.httpsPort instead of.")
    /* istanbul ignore next */
    public setHttpsPort(port: number | string): ServerLoader {

        this._settings.httpsPort = port;

        return this;
    }

    /**
     * Change the global endpoint path.
     * @deprecated
     * @param endpoint
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setEndpoint() is deprecated. Use ServerLoader.mount() instead of.")
    /* istanbul ignore next */
    public setEndpoint(endpoint: string): ServerLoader {

        this._settings.endpoint = endpoint;

        return this;
    }

    /**
     * Scan and imports all files matching the pattern. See the document on the [Glob](https://www.npmjs.com/package/glob)
     * pattern for more information.
     *
     * #### Example
     *
     * ```typescript
     * import {ServerLoader} from "ts-express-decorators";
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
     * !> On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.
     *
     * ```typescript
     * const controllerPattern = Path.join(rootDir, 'controllers','**','*.js');
     * ```
     *
     * @param path
     * @param endpoint
     * @returns {ServerLoader}
     */
    public scan(path: string, endpoint: string = this._settings.endpoint): ServerLoader {

        path = Path.resolve(path);

        let files: string[] = require("glob").sync(path);
        let nbFiles = 0;

        $log.info(`Scan files : ${path}`);

        this._components = (this._components || [])
            .concat(files
                .map((file: string) => {
                    nbFiles++;
                    $log.debug(`Import file ${endpoint}:`, file);
                    const classes: any[] = require(file);
                    return {file, endpoint, classes};
                }))
            .filter(o => !!o);

        return this;
    }


    /**
     * ServerLoader.onError() is deprecated. Use your own middleware instead of.
     * @deprecated
     */
    @Deprecated("ServerLoader.onError() is deprecated. Use your own middleware instead of.")
    /* istanbul ignore next */
    public onError() {

    }

    /**
     * Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob))
     * under the endpoint. See [Versioning Rest API](docs/server-loader/versioning.md) for more informations.
     * @param endpoint
     * @param path
     * @returns {ServerLoader}
     */
    public mount(endpoint: string, path: string | string[]): ServerLoader {

        [].concat(path as any).forEach((path: string) => {
            this.scan(path, endpoint);
        });

        return this;
    }

    /**
     * Initialize configuration of the express app.
     */
    protected async loadMiddlewares(): Promise<any> {

        $log.debug("Mount middlewares");

        this.use(LogIncomingRequestMiddleware);
        await this.callHook("$onMountingMiddlewares", undefined, this.expressApp);
        await this.injectorService.emit("$beforeRoutesInit");
        await this.injectorService.emit("$onRoutesInit", this._components);

        delete this._components; // free memory

        await this.injectorService.emit("$afterRoutesInit");

        await this.callHook("$afterRoutesInit", undefined, this.expressApp);

        // Import the globalErrorHandler

        /* istanbul ignore next */
        if (this.hasHook("$onError")) {
            this.use((this as any)["$onError"].bind(this));
        }

        this.use(GlobalErrorHandlerMiddleware);
    }

    /**
     *
     */
    protected setSettings(settings: IServerSettings) {

        this._settings.set(settings);

        if (this.settings.env === "test") {
            $log.stop();
        }

        const settingsService = this.getSettingsService();

        const bind = (property: string, value: any, map: Map<string, any>) => {

            switch (property) {
                case "mount":
                    Object.keys(settingsService.mount).forEach((key) => this.mount(key, value[key]));
                    break;

                case "componentsScan":
                    settingsService.componentsScan.forEach(componentDir => this.scan(componentDir));
                    break;

                case "httpPort":
                    /* istanbul ignore else */
                    if (value && this._httpServer === undefined) {
                        this.createHttpServer(value);
                    }

                    break;

                case "httpsPort":

                    /* istanbul ignore else */
                    if (value && this._httpsServer === undefined) {
                        this.createHttpsServer(Object.assign(map.get("httpsOptions") || {}, {port: value}));
                    }

                    break;
            }
        };


        settingsService
            .forEach((value, key, map) => {

                /* istanbul ignore else */
                if (value) {
                    bind(key, value, map);
                }
            });


    }

    /**
     * Return the settings configured by the decorator [@ServerSettings](api/common/server/decorators/serversettings.md).
     *
     * @ServerSettings({
     *    rootDir: Path.resolve(__dirname),
     *    port: 8000,
     *    httpsPort: 8080,
     *    mount: {
     *      "/rest": "${rootDir}/controllers/**\/*.js"
     * }
     * })
     * export class Server extends ServerLoader {
     *     $onInit(){
     *         console.log(this.settings); // {rootDir, port, httpsPort,...}
     *     }
     * }
     * ```
     *
     * @returns {ServerSettingsProvider}
     */
    get settings(): ServerSettingsProvider {
        return this._settings;
    }

    /**
     * Return Express Application instance.
     * @returns {core.Express}
     */
    get expressApp(): Express.Application {
        return this._expressApp;
    }

    /**
     * Return the injectorService initialized by the server.
     * @returns {InjectorService}
     */
    get injectorService(): InjectorService {
        return this._injectorService;
    }

    /**
     * Return Http.Server instance.
     * @returns {Http.Server}
     */
    get httpServer(): Http.Server {
        return this._httpServer;
    }

    /**
     * Return Https.Server instance.
     * @returns {Https.Server}
     */
    get httpsServer(): Https.Server {
        return this._httpsServer;
    }
}