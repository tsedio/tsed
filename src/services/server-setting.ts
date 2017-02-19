
import * as Path from "path";
import {ExpressApplication} from "./express-application";
const rootDir = Path.dirname(require.main.filename);

export type Env = "production" | "development" | "test";

export class EnvTypes {
    static PROD = "production";
    static DEV = "development";
    static TEST = "test";
}

export class ServerSettingsService {
    /**
     *
     */
    protected _env: Env;
    /**
     *
     */
    protected _httpPort: string | number;
    /**
     *
     */
    protected _httpsPort: string | number;
    /**
     * Endpoint base.
     * @type {string}
     */
    protected _endpointUrl: string = "/rest";
    /**
     * Upload directory
     * @type {string}
     */
    protected _uploadDir: string = `${rootDir}/uploads`;
    /***
     *
     * @type {Map<string, any>}
     */
    protected map = new Map<string, any>();

    constructor(settings?: ServerSettingsProvider) {
        if (settings) {
            this.map = settings.map;
            this._endpointUrl = settings._endpointUrl;
            this._env = settings._env;
            this._httpPort = settings._httpPort;
            this._httpsPort = settings._httpsPort;
            this._uploadDir = settings._uploadDir;
        }
    }

    /**
     *
     * @returns {string}
     */
    get endpoint(): string {
        return this._endpointUrl;
    }

    /**
     *
     * @returns {Env}
     */
    get env(): Env {
        return this._env;
    }

    /**
     *
     * @returns {string|number}
     */
    getHttpPort(): {address: string, port: number} {
        return ServerSettingsService.buildAddressAndPort(this._httpPort);
    }

    /**
     *
     * @returns {string|number}
     */
    getHttpsPort(): {address: string, port: number} {
        return ServerSettingsService.buildAddressAndPort(this._httpsPort);
    }

    /**
     *
     * @returns {string}
     */
    get uploadDir(): string {
        return this._uploadDir;
    }

    /**
     *
     * @param propertyKey
     * @returns {undefined|any}
     */
    get(propertyKey: string): any {
        return this.map.get(propertyKey);
    }

    private static buildAddressAndPort(addressPort: string | number): {address: string, port: number} {
        let address = "0.0.0.0";
        let port = addressPort;

        if (typeof addressPort === "string" && addressPort.indexOf(":") > -1) {
            [address, port] = addressPort.split(":");
        }

        return {address, port: +port};
    }
}

export class ServerSettingsProvider extends ServerSettingsService {

    constructor(private expressApp: ExpressApplication) {
        super();

        this._env = process.env.NODE_ENV || this.expressApp.get('_env') || "development"
    }

    set httpPort(value: string | number) {
        this._httpPort = value;
    }

    set httpsPort(value: string | number) {
        this._httpsPort = value;
    }

    set uploadDir(value: string) {
        this._uploadDir = value;
    }

    set endpoint(value: string) {
        this._endpointUrl = value;
    }

    set env(value: Env) {
        this._env = value as Env;
    }

    set(propertyKey: string, value: any) {
        this.map.set(propertyKey, value);
    }

    private $get = () => {
        return new ServerSettingsService(this);
    }
}