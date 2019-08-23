import {Env} from "@tsed/core";
import {ProviderScope} from "@tsed/di";
import * as Https from "https";
import {IErrorsSettings} from "./IErrorSettings";
import {ILoggerSettings} from "./ILoggerSettings";
import {IRouterSettings} from "./IRouterSettings";
import {IServerMountDirectories} from "./IServerMountDirectories";

declare global {
  namespace TsED {
    interface Configuration {
      /**
       * The root directory where you build run project. By default, it's equal to `process.cwd().
       */
      rootDir: string;
      /**
       * The environment profile. By default the environment profile is equals to `NODE_ENV`.
       */
      env: Env;
      /**
       * Port number for the [HTTP.Server](https://nodejs.org/api/http.html#http_class_http_server).
       */
      port: string | number;
      /**
       * Port number for the [HTTP.Server](https://nodejs.org/api/http.html#http_class_http_server).
       */
      httpPort: string | number | boolean;
      /**
       * Port number for the [HTTPs.Server](https://nodejs.org/api/https.html#https_class_https_server).
       */
      httpsPort: string | number | boolean;
      /**
       * [Https.ServerOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)):
       * - `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different algorithms an array can be provided either as a plain array of key strings or an array of objects in the format `{pem: key, passphrase: passphrase}`. This option is required for ciphers that make use of private keys.
       * - `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
       * - `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers containing the certificate key of the server in PEM format. (Required)
       * - `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings, or array of Buffers of trusted certificates in PEM format. If this is omitted several well known "root" CAs (like VeriSign) will be used. These are used to authorize connections.
       */
      httpsOptions: Https.ServerOptions;
      /**
       * The temporary directory to upload the documents. See more on [Upload file with Multer](/tutorials/multer.md)
       */
      uploadDir: string;
      /**
       * Mount all controllers under a directories to an endpoint.
       */
      mount: IServerMountDirectories;
      /**
       * List of directories to scan [Services](/docs/services.md), [Middlewares](/docs/middlewares.md) or [Converters](/docs/converters.md).
       */
      componentsScan: (string | RegExp)[];
      /**
       * List of glob patterns. Exclude all files which matching with this list when ServerLoader scan all components with the `mount` or `scanComponents` options.
       */
      exclude: string[];
      /**
       * Configure the mimes accepted by default by the server.
       */
      acceptMimes: string[];
      /**
       * Enable debug mode. By default debug is false.
       */
      debug: boolean;
      /**
       * @deprecated Use logger.requestField
       */
      logRequestFields: ("reqId" | "method" | "url" | "headers" | "body" | "query" | "params" | "duration")[];
      /**
       * Use a strict validation when a model is used by the converter.
       * When a property is unknown, it throw a `BadRequest` (see [Converters](/docs/converters.md)).
       * By default true.
       */
      validationModelStrict: boolean;
      /**
       * Logger configuration.
       */
      logger: Partial<ILoggerSettings>;
      /**
       * Errors configuration.
       */
      errors: Partial<IErrorsSettings>;
      /**
       * Configure the default scope of the controllers.
       *
       * - Default: `singleton`. See [Scope](/docs/injection-scopes.md).
       * - Values: `singleton`, `request`.
       *
       * @deprecated Use scopes["CONTROLLER"] instead.
       */
      controllerScope: ProviderScope;
      /**
       * Global configuration for the Express.Router. See express [documentation](http://expressjs.com/en/api.html#express.router).
       */
      routers: IRouterSettings;
      /**
       * Object to mount all directories under to his endpoints. See more on [Serve Static](/tutorials/serve-static-files.md).
       */
      statics: IServerMountDirectories;
      /**
       * Object to mount all directories under to his endpoints. See more on [Serve Static](/tutorials/serve-static-files.md).
       * @deprecated
       */
      serveStatic: IServerMountDirectories;
    }
  }
}

export * from "./IErrorSettings";
export * from "./ILoggerSettings";
export * from "./IRouterSettings";
export * from "./IServerMountDirectories";
export * from "./IServerSettings";
