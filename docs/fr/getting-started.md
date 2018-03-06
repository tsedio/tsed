# Commencer
## Installation

Vous pouvez récupérer la dernier version de Ts.ED en utilisant la commande npm suivante:

```bash
$ npm install --save-dev typescript @types/express
$ npm install --save express@4 @tsed/core @tsed/common
```

Les modules suivants sont aussi recommendés:

```bash
$ npm install --save body-parser compression cookie-parser method-override
$ npm install --save-dev ts-node nodemon
```

> **Important!** Ts.ED nécessites Node >= 6, Express >= 4, TypeScript >= 2.0 et 
les options de compilations `experimentalDecorators`, `emitDecoratorMetadata`, `types` et `lib` 
dans votre fichier `tsconfig.json`.

```json
{
  "compilerOptions": {
    "target": "es2015",
    "lib": ["es2015"],
    "types": ["reflect-metadata"],
    "module": "commonjs",
    "moduleResolution": "node",
    "experimentalDecorators":true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "declaration": false
  },
  "exclude": [
    "node_modules"
  ]
}
```

> **Note** : target must be set to ES2015/ES6 (or more).

### Optionnel 

Vous pouvez copier cette exemple de package.json pour développer votre application:

```json
{
  "name": "test-ts-express-decorator",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "npm run tsc",
    "coverage": "npm run test-cov && npm run test-remap",
    "postinstall": "npm run build",
    "tslint": "tslint ./*.ts ./lib/*.ts",
    "test": "mocha --reporter spec --check-leaks --bail test/",
    "tsc": "tsc --project tsconfig.json",
    "tsc:w": "tsc -w",
    "start": "nodemon --watch '**/*.ts' --ignore 'node_modules/**/*' --exec ts-node app.ts"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@tsed/core": "4.0.0",
    "@tsed/common": "4.0.0",
    "body-parser": "^1.15.2",
    "compression": "^1.6.2",
    "cookie-parser": "^1.4.3",
    "express": "^4.14.0",
    "method-override": "^2.3.6"
  },
  "devDependencies": {
    "@types/express": "^4.0.37",
    "ts-node": "^3.3.0",
    "nodemon": "^1.11.0",
    "typescript": "^2.4.3"
  }
}
```
> Ensuite utilisez la commande `npm install && npm start` pour démarrer votre serveur. 

## Démarrage rapide
### Créer votre serveur

Ts.ED fournit une classe `ServerLoader` pour configurer votre application Express rapidement.
Créer simplement un fichier `server.ts` à la racine de votre projet et implémenter
une nouvelle classe `Server` qui hérite de [`ServerLoader`](docs/server-loader/_sidebar.md).

#### Avec les decorateurs

```typescript
import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from "@tsed/common";
import Path = require("path");

@ServerSettings({
    rootDir: Path.resolve(__dirname), // optional. By default it's equal to process.cwd()
    acceptMimes: ["application/json"]
})
export class Server extends ServerLoader {

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void|Promise<any> {
    
        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public $onReady(){
        console.log('Server started...');
    }
   
    public $onServerInitError(err){
        console.error(err);
    }
}

new Server().start();
```
> Par defaut ServerLoader charge les controlleurs depuis le dossier `${rootDir}/controllers` et les montes sous le endpoint `/rest`.

Pour configurer le serveur regardez la page de [Configuration](configuration.md) qui lui est dédié.

#### Avec les méthodes

```typescript
import {ServerLoader, GlobalAcceptMimesMiddleware} from "@tsed/common";
import * as Path from "path";

export class Server extends ServerLoader {
    /**
     * In your constructor set the global endpoint and configure the folder to scan the controllers.
     * You can start the http and https server.
     */
    constructor() {
        super();

        const appPath: string = Path.resolve(__dirname);
        
        this.mount("/rest", appPath + "/controllers/**/**.js")    // Declare the directory that contains your controllers
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    $onMountingMiddlewares(): void|Promise<any> {
    
        const morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');

        this
            .use(morgan('dev'))
            .use(GlobalAcceptMimesMiddleware)

            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        return null;
    }

    public $onReady(){
        console.log('Server started...');
    }
   
    public $onServerInitError(err){
        console.error(err);
    }
}

new Server().start();
```

## Créer votre premier controlleur

Commencez par créer un nouveau controlleur `CalendarCtrl.ts` dans le dossier des controlleurs (par défaut `root/controllers`).
Tous les controlleurs annoté avec `@Controller` est considéré comme étant un routeur Express.
Un routeur Express nécessite qu'on lui fournisse une portion d'url  (par exemple `/calendars`) pour qu'il soit exposé par l'application Express.

Cette portion d'url sera utilisé par le ServerLoader pour contruire l'url final et dépendra de la configuration de votre serveur (voir [Configuragtion](configuration.md)
et les [dépendences entres controlleurs](docs/controllers.md). 

Dans ce cas précis, il n'y a pas dépendences configuré entres deux controlleurs. Nous aurons donc une url pour CalendarCtrl
qui sera la suivante `http://host/rest/calendars`.

```typescript
import {
    Controller, Get, Render, Post, 
    Authenticated, Required, BodyParams,
    Delete
} from "@tsed/common";

export interface Calendar{
    id: string;
    name: string;
}

@Controller("/calendars")
export class CalendarCtrl {

    @Get("/")
    @Render("calendars/index") 
    async renderCalendars(@Required() @BodyParams("calendar") calendar: Calendar): Promise<Array<Calendar>> {
        return [{id: '1', name: "test"}];
    }
    
    @Post("/")
    @Authenticated()
    async post(
        @Required() @BodyParams("calendar") calendar: Calendar
    ): Promise<Calendar> {
        return new Promise((resolve: Function, reject: Function) => {
            calendar.id = "1";
            resolve(calendar);
        });
    }
    
    @Delete("/")
    @Authenticated()
    async post(
        @BodyParams("calendar.id") @Required() id: string 
    ): Promise<Calendar> {
        return {id, name: "calendar"};
    }
}
```
> **Note** : Les décorateurs `@Get`, `@Post`, `@Delete`, `@Put`, etc..., supportent les paramètres de path dynamique (ex: `/:id`) et les `RegExp` à l'instar d'Express. 

Pour tester votre API, lancez votre `server.ts` et envoyez une requête HTTP sur l'url `/rest/calendars/1`.

### Prêt pour faire plus ?

Nous avons brièvement exposé les possibilités du framework Ts.ED. Les guides suivants couvrent les notions basiques et avancées du framework en détails. Nous vous encourageons à lire tout ça !

<div class="guide-links">
<a href="#/configuration">Configuration</a>
<a href="#/docs/controllers">Controlleurs</a>
</div>

***

### Other topics

<div class="topics">
  [Controlleurs](docs/controllers.md)
  [Services](docs/services/overview.md)
  [Middlewares](docs/middlewares/overview.md)
  [Scope](docs/scope.md)
  [JSON Schema](docs/jsonschema.md)
  [Converters](docs/converters.md)
  [Filters](docs/filters.md)
  [Test](docs/testing.md)
  [Authentification](docs/middlewares/override/authentication.md)
  [Gestion global des erreurs](docs/middlewares/override/global-error-handler.md)
  [Guides](tutorials/overview.md)
  [Passport.js](tutorials/passport.md)
  [Socket.io](tutorials/socket-io.md)
  [Swagger](tutorials/swagger.md)
  [Upload de fichiers](tutorials/upload-files-with-multer.md)
  [Exposé des fichiers statiques](tutorials/serve-static-files.md)
  [Templating](tutorials/templating.md)
  [Les erreurs HTTP](tutorials/throw-http-exceptions.md)
  [Projet sous AWS](tutorials/aws.md)
</div>  
