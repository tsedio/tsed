import {isClass} from "@tsed/core";
import * as Express from "express";
import * as globby from "globby";
import * as Http from "http";
import * as Https from "https";
import * as Path from "path";
import {$log} from "ts-log-debug";
import {ServerSettingsProvider} from "../../config";
import {IServerSettings} from "../../config/interfaces/IServerSettings";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {InjectorService} from "../../di";

import {ExpressApplication, GlobalErrorHandlerMiddleware} from "../../mvc";
import {HandlerBuilder} from "../../mvc/class/HandlerBuilder";
import {LogIncomingRequestMiddleware} from "../../mvc/components/LogIncomingRequestMiddleware";
import {MiddlewareRegistry} from "../../mvc/registries/MiddlewareRegistry";
import {HttpServer} from "../decorators/httpServer";
import {HttpsServer} from "../decorators/httpsServer";
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
$log.name = "TSED";
$log.level = "info";

export abstract class ServerLoader implements IServerLifecycle {
    public version: string = "0.0.0-PLACEHOLDER";
    private _expressApp: Express.Application = Express();
    private _settings: ServerSettingsProvider;
    private _components: IComponentScanned[] = [];
    private _httpServer: Http.Server;
    private _httpsServer: Https.Server;
    private _injectorService: InjectorService;
    private _scannedPromises: Promise<any>[] = [];

    /**
     *
     */
    constructor() {

        this._settings = InjectorService.get<ServerSettingsProvider>(ServerSettingsService);

        // Configure the ExpressApplication factory.
        InjectorService.factory(ExpressApplication, this.expressApp);

        const settings = ServerSettingsProvider.getMetadata(this);

        if ((this as any).$onAuth) {
            $log.warn("The $onAuth hooks is removed. Use OverrideMiddleware method instead of. See https://goo.gl/fufBTE.");
        }

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

        const httpServer: any = this._httpServer = Http.createServer(this._expressApp);
        httpServer.get = () => httpServer;

        InjectorService.factory(HttpServer, httpServer);

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
        const httpsServer: any = this._httpsServer = Https.createServer(options, this._expressApp);
        httpsServer.get = () => httpsServer;

        InjectorService.factory(HttpsServer, httpsServer);

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
            if (MiddlewareRegistry.has(arg)) {
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
            $log.debug(`\x1B[1mCall hook ${key}\x1B[22m`);
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
            await Promise.all(this._scannedPromises);
            await this.callHook("$onInit");
            await this.loadSettingsAndInjector();

            $log.debug("Settings and injector loaded");

            await this.loadMiddlewares();
            await this.startServers();
            await this.callHook("$onReady");

            await this.injectorService.emit("$onServerReady");

            $log.info(`Started in ${new Date().getTime() - start.getTime()} ms`);

        } catch (err) {
            this.callHook("$onServerInitError", undefined, err);

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
     * !> On windows on can have an issue with the Glob pattern and the /. To solve it, build your path pattern with the module Path.
     *
     * ```typescript
     * const controllerPattern = Path.join(rootDir, 'controllers','**','*.js');
     * ```
     *
     * @param patterns
     * @param endpoint
     * @returns {ServerLoader}
     */
    public scan(patterns: string | string[], endpoint?: string): ServerLoader {
        const promises = globby
            .sync(ServerLoader.cleanGlobPatterns(patterns, this.settings.exclude))
            .map(async (file: string) => {
                $log.debug(`Import file ${endpoint}:`, file);
                try {
                    const classes: any[] = await import(file);
                    this.addComponents(classes, {endpoint});
                } catch (er) {
                    /* istanbul ignore next */
                    $log.error(er);
                    /* istanbul ignore next */
                    process.exit(-1);
                }
            });

        this._scannedPromises = this._scannedPromises.concat(promises);

        return this;
    }


    /**
     * Add classes to the components list
     * @param classes
     * @param options
     */
    public addComponents(classes: any | any[], options: Partial<IComponentScanned> = {}): ServerLoader {
        classes = Object
            .keys(classes)
            .map((key) => classes[key])
            .filter((clazz) => isClass(clazz));

        const components: any = Object.assign(options, {
            classes
        });

        this._components = (this._components || [])
            .concat([components])
            .filter(o => !!o);

        return this;
    }

    /**
     * Add classes decorated by `@Controller()` to components container.
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
     * ?> If the MyController class isn't decorated, the class will be ignored.
     *
     * @param {string} endpoint
     * @param {any[]} controllers
     * @returns {ServerLoader}
     */
    public addControllers(endpoint: string, controllers: any[]) {
        return this.addComponents(controllers, {endpoint});
    }

    /**
     * Mount all controllers files that match with `globPattern` ([Glob Pattern](https://www.npmjs.com/package/glob))
     * under the endpoint. See [Versioning Rest API](docs/server-loader/versioning.md) for more informations.
     * @param endpoint
     * @param list
     * @returns {ServerLoader}
     */
    public mount(endpoint: string, list: any | string | (any | string)[]): ServerLoader {

        const patterns = []
            .concat(list)
            .filter((item: string) => {
                if (isClass(item)) {
                    this.addControllers(endpoint, [item]);
                    return false;
                }
                return true;
            });

        this.scan(patterns, endpoint);

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

    /**
     *
     * @returns {any}
     * @param files
     * @param excludes
     */
    static cleanGlobPatterns(files: string | string[], excludes: string[]): string[] {
        excludes = excludes
            .map((s: string) => "!" + s.replace(/!/gi, ""));

        return []
            .concat(files as any)
            .map((file: string) => {
                if (!require.extensions[".ts"]) {
                    file = file.replace(/\.ts$/i, ".js");
                }
                return Path.resolve(file);
            })
            .concat(excludes as any);
    }
}