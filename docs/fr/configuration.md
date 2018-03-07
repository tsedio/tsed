# Configuration

Le décorateur `@ServerSettings` vous permet de configurer le serveur simplement. Le décorateur à l'initialisation 
merger votre configuration avec celle par défaut.

La configuration du serveur par défaut est la suivante :

```json
{
  "rootDir": "path/to/root/project", // By default: process.cwd()
  "env": "development",
  "port": 8080,
  "debug": false,
  "httpsPort": 8000,
  "uploadDir": "${rootDir}/uploads",
  "mount": {
    "/rest": "${rootDir}/controllers/**/*.ts" // support ts with ts-node then fallback to js
  },
  "componentsScan": [
    "${rootDir}/middlewares/**/*.ts",
    "${rootDir}/services/**/*.ts",
    "${rootDir}/converters/**/*.ts"
  ],
  "routers": {
    "mergeParams": false,
    "strict": false,
    "caseSensitive": false
  }
}
```

Voici un exemple de configuration possible pour votre serveur:

```typescript
// server.ts
import {ServerLoader, ServerSettings} from "@tsed/common";
import Path = require("path");

@ServerSettings({
   rootDir: Path.resolve(__dirname), //optional. By default it's equal to process.cwd()
   mount: {
     "/rest": "${rootDir}/controllers/current/**/*.js",
     "/rest/v1": [
        "${rootDir}/controllers/v1/users/*.js", 
        "${rootDir}/controllers/v1/groups/**/*.ts", // support ts entry
        "!${rootDir}/controllers/v0/groups/old/*.ts",
        MyController // support manual import
     ]
   }
})
export class Server extends ServerLoader {

}

// app.ts
import * as Server from "./server";
new Server.start();
```

> Ts.ED supporte [ts-node](https://github.com/TypeStrong/ts-node). Il est donc possible de préciser votre configuration
 avec des fichiers d'extension en `.ts`. Ts.ED remplacera automatique les extensions en `.ts` si ts-node n'est pas importé 
 dans votre projet (runtime node.js)

!> Note: le flag `${rootDir}` sera remplacé par le valeur de la configuration rootDir. Vous pouvez aussi utiliser des chemins relatif ou absolue.

## Options

* `rootDir` &lt;string&gt;: La racine du projet où s'execute votre projet. Par défaut: `process.cwd().
* `env` &lt;Env&gt;: Le profil de l'environement. Par défaut: `process.env.NODE_ENV`.
* `port` &lt;string | number&gt;: Numéro de port [HTTP.Server](https://nodejs.org/api/http.html#http_class_http_server). Il est aussi possible de préciser l'adresse IP pour ce port.
* `httpsPort` &lt;string | number&gt;: Numéro de port [HTTPs.Server](https://nodejs.org/api/https.html#https_class_https_server). Il est aussi possible de préciser l'adresse IP pour ce port.
* `httpsOptions` &lt;[Https.ServerOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener))&gt;:
  * `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | &lt;Object[]&gt;: La clé privée du serveur au format PEM. Pour prendre en charge plusieurs clés à l'aide d'algorithmes différents, un tableau peut être fourni sous la forme d'un tableau simple de chaînes de strings ou d'un tableau d'objets au format `{pem: key, passphrase: passphrase}`. Cette option est obligatoire pour les chiffrements utilisant des clés privées.
  * `passphrase` &lt;string&gt; Un string contenant le passphrase pour la clé privée ou pfx.
  * `cert` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): Un string, ou un tableau de string ou un tableau de Buffer contenant la clé de certificat du serveur au format PEM. (Required)
  * `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer) | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): Un string, ou un tableau de string ou un tableau de Buffer de certificats approuvés au format PEM. Les CA (comme VeriSign) seront utilisés. Ils sont utilisés pour autoriser les connexions.
* `uploadDir` &lt;string&gt: Le dossier temporaire pour le chargement de fichie. Voir [Upload file with Multer](tutorials/upload-files-with-multer.md).
* `mount` &lt;[IServerMountDirectories](api/common/config/iservermountdirectories.md)&gt;: Monte les controllers en fonction des routes. Chaque routes acceptes une liste de controlleurs (classe) et/ou une liste de patterns Glob.
* `componentsScan` &lt;string[]&gt;: List of directories to scan [Services](docs/services/overview.md), [Middlewares](docs/middlewares/overview.md) or [Converters](docs/converters.md).
* `serveStatic` &lt;[IServerMountDirectories](api/common/config/iservermountdirectories.md)&gt;: Monte les répertoires de contenu statiques associés à une route. See more on [Serve Static](tutorials/serve-static-files.md).
* `swagger` &lt;Object&gt;: Configuration de Swagger. See more on [Swagger](tutorials/swagger.md).
* `debug` &lt;boolean&gt;: Active le mode `debug`. Par défaut: `false`.
* `routers` &lt;object&gt;: Configuration globale d'Express.Router. Voir la [documentation Express](http://expressjs.com/en/api.html#express.router).
* `validationModelStrict` &lt;boolean&gt;: Active la validation stricte des modèles au niveau du service Converters (voir [Converters](docs/converters.md)). Par défaut: `true`.
* `logger` &lt;[ILoggerSettings](api/common/config/iloggersettings.md)&gt;: Configuration du logger.

## Serveur HTTP & HTTPs
### Changement d'adresse

Il est possible de changer l'adresse du serveur HTTP et HTTPS de la façon suivante:

```typescript
@ServerSettings({
   httpPort: "127.0.0.1:8081",
   httpsPort: "127.0.0.2:8082",
})
export class Server extends ServerLoader {

}
```

### Désactiver HTTP

```typescript
@ServerSettings({
   httpPort: false,
})
export class Server extends ServerLoader {

}
```

### Désactiver HTTPS

```typescript
@ServerSettings({
   httpsPort: false,
})
export class Server extends ServerLoader {

}
```

### Configuration du serveur HTTPs

Vous pouvez consulter l'exemple suivant [projet HTTPs](https://github.com/Romakita/example-ts-express-decorator/tree/2.0.0/example-https)

## Logger
### Logger par défaut

Le logger par défaut utilisé par Ts.ED est [Ts.LogDebug](https://romakita.github.io/ts-log-debug/). 

 - [Configuration](https://romakita.github.io/ts-log-debug#/getting-started?id=installation),
 - [Customiser un Appender (chanel)](https://romakita.github.io/ts-log-debug#/appenders/custom),
 - [Customiser le layout](https://romakita.github.io/ts-log-debug#/layouts/custom)

### Configuration

- `logger.debug` (or `debug`): Active le mode `debug`. Par défaut: `false`.
- `logger.logRequest`: Log toutes les requêtes entrantes et affiche les champs configurés avec `logger.requestFields`. Par défaut: `true`.
- `logger.requestFields`: Liste des champs affichés dans les logs. Valeurs possibles: `reqId`, `method`, `url`, `headers`, `body`, `query`,`params`, `duration`.
- `logger.reqIdBuilder`: Fonction qui sera appelée pour chaque rêquête. La fonction doit retourner un id unique qui identifiera la requête.

> Il est recommendé de désactivé les logges en production. Le logger a un coût sur les performances.

### Request logger

Pour chaque requête entrante, un logger sera attaché à l'objet Express.Request. Il peut être utilisé de la façon suivante :

```typescript
request.log.info({customData: "test"}) // parameter is optional
request.log.debug({customData: "test"})
request.log.warn({customData: "test"})
request.log.error({customData: "test"})
request.log.trace({customData: "test"})
```

Chacun de ces appels vont générer un log en fonction de la configuration `logger.requestFields` comme suivant :

```bash
[2017-09-01 11:12:46.994] [INFO ] [TSED] - {
  "status": 200,
  "reqId": 1,
  "method": "GET",
  "url": "/api-doc/swagger.json",
  "duration": 92,
  "headers": {
    "host": "0.0.0.0:8001",
    "connection": "keep-alive",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate",
    "accept-language": "fr-FR,fr;q=0.8,en-US;q=0.6,en;q=0.4"
  },
  "body": {},
  "query": {},
  "customData": "test"
}
```

Vous pouvez configurer les champs à afficher au niveau du Server comme ceci :

```typescript
@ServerSettings({
   logger: {
       requestFields: ["reqId", "method", "url", "headers", "body", "query","params", "duration"]
   }
})
export class Server extends ServerLoader {

}
```

Vous pouvez également surcharger le middleware `LogIncomingRequestMiddleware` qui est 
responsable des logs avec l'annotation `@OverrideMiddlewre`:

```typescript
@OverrideMiddleware(LogIncomingRequestMiddleware)
export class CustomLogIncomingRequestMiddleware extends LogIncomingRequestMiddleware {
 
    public use(@Req() request: any, @Res() response: any) {
    
        // you can set a custom ID with another lib
        request.id = require('uuid').v4()
        
        return super.use(request, response); // required 
    }
    
    protected requestToObject(request) {
        return {
           reqId: request.id,
           method: request.method,
           url: request.originalUrl || request.url,
           duration: new Date().getTime() - request.tsedReqStart.getTime(),
           headers: request.headers,
           body: request.body,
           query: request.query,
           params: request.params
        }
    }
}
```

### Désactiver le logger

La méthode `$log.shutdown()` retourne une instance Promise qui sera résolue lorsque Ts.LogDebug aura fermé tous les `appenders`
et qu'il aura terminé d'écrire les logs.

Utilisez cette méthode lorsque votre programme est interrompue pour être sûr que les logs ont bien été écrit dans les fichiers.

```typescript
import {$log} from "ts-log-debug";

$log
  .shutdown()
  .then(() => {
     console.log("Complete")
  }); 
```

## Get configuration

La configuration peut être réutilisé n'importe où dans votre application et ceux de plusieurs façon :
- Via injection de dépendence dans un [Service](docs/services/overview.md) ou [Controller](docs/controllers.md), [Middleware](docs/middlewares/overview.md), [Filter](docs/filters.md) or [Converter](docs/converters.md)
- Via les annotations [@Constant](api/common/config/constant.md) ou [@Value](api/common/config/value.md),
- ou via l'objet `GlobalServerSettings`.

### Par injection

```typescript
import {ServerSettingsService} from "@tsed/common";
@Service() // or Controller or Middleware
export class MyService {
    constructor(serverSettingsService: ServerSettingsService) {
        
    }
}
```

### Par annotation

Les décorateurs [@Constant](api/common/config/constant.md) et [@Value](api/common/config/value.md) peuvent 
être utilisé sur les classes telles que: 

 - [Service](docs/overview/services.md), 
 - [Controller](docs/controllers.md),
 - [Middleware](docs/middlewares/overview.md),
 - [Filter](docs/filters.md) 
 - [Converter](docs/converters.md).

[@Constant](api/common/config/constant.md) et [@Value](api/common/config/value.md) acceptent une expression en tant que paramètre.
 Cette expression sera utilisée pour inspecter un objet et retourner la valeur attendu.

```typescript
import {Env} from "@tsed/core";
import {Constant, Value} from "@tsed/common";

export class MyClass {
    
    @Constant("env")
    env: Env;
    
    @Value("swagger.path")
    swaggerPath: string;
    
}
```

!> `@Constant` retourne une valeur immutable avec `Object.freeze(). 

<div class="guide-links">
<a href="#/docs/controllers">Controllers</a>
<a href="#/docs/services/overview">Services</a>
</div>
