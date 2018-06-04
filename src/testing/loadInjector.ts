import {ExpressApplication, HttpsServer, InjectorService, ServerSettingsService, HandlerBuilder, HttpServer, IHTTPSServerOptions} from "@tsed/common";
import {Env} from "@tsed/core";

import * as Express from "express";
import * as Http from "http";
import * as Https from "https";

/**
 *
 * @param {InjectorService} injector
 */
function expressApplication(injector: InjectorService) {
    const expressApp = Express();
    const originalUse = expressApp.use;

    /* istanbul ignore next */
    expressApp.use = function (...args: any[]) {
        args = args.map(arg => {
            if (injector.has(arg)) {
                arg = HandlerBuilder.from(arg).build(injector!);
            }

            return arg;
        });

        return originalUse.call(this, ...args);
    };

    injector!.forkProvider(ExpressApplication, expressApp);
}

/**
 * Create a new HTTP server with the provided `port`.
 * @returns {ServerLoader}
 */
function createHttpServer(injector: InjectorService, port: string | number) {
    const httpServer: any = Http.createServer(injector!.get(ExpressApplication));
    // TODO to be removed
    /* istanbul ignore next */
    httpServer.get = () => httpServer;

    injector!.forkProvider(HttpServer, httpServer);
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
 * @param injector
 * @param options Options to create new HTTPS server.
 * @returns {ServerLoader}
 */
function createHttpsServer(injector: InjectorService, options: IHTTPSServerOptions) {
    const httpsServer: any = Https.createServer(options, injector!.get(ExpressApplication));

    // TODO to be removed
    /* istanbul ignore next */
    httpsServer.get = () => httpsServer;

    injector!.forkProvider(HttpsServer, httpsServer);
}

export function loadInjector() {
    const injector = new InjectorService();
    const hasExpress = injector.has(ExpressApplication);

    if (!hasExpress) {
        expressApplication(injector);
    }

    if (!injector.has(HttpServer)) {
        createHttpServer(injector, 8080);
    }

    if (!injector.has(HttpsServer)) {
        createHttpsServer(injector, {port: 8081});
    }

    if (!hasExpress) {
        injector.get<ServerSettingsService>(ServerSettingsService)!.env = Env.TEST;

        /* istanbul ignore next */
        injector.load().catch(err => {
            console.error(err);
            process.exit(-1);
        });
    }

    return injector;
}
