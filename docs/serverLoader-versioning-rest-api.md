[Home](https://github.com/Romakita/ts-express-decorators/wiki) > [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader) > Versioning Rest API

> This feature is available only for TsExpressDecorators v1.3.x on higher.

### With @ServerSettings decorator

Since v1.4.x you can use [@ServerSettings](https://github.com/Romakita/ts-express-decorators/wiki/Configure-server-with-decorator) to versionning your Rest API:
```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir,
   mount: {
     "/rest": "${rootDir}/controllers/current/**/*.js",
     "/rest/v1": "${rootDir}/controllers/v1/**/*.js"
   }
})
export class Server extends ServerLoader {

}

new Server().start();
```

### With ServerLoader API

TsExpressDecorator provide the possibility to mount multiple Rest path instead of the default path `/rest` that is settled with method [`ServerLoader.setEndpoint('/rest')`](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader----API#serverloadersetendpointendpoint-serverloader). 

TsExpressDecorators v1.3.x introduce the new method `ServerLoader.mount(endpoint, controllersDir)` and let you to versioning your REST API as follow:

```typescript
import {ServerLoader, IServerLifecycle} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader implements IServerLifecycle {

    constructor() {
        super();

        const appPath: string = Path.resolve(__dirname);

        this.mount('rest/', appPath + "/controllers/**/**.js") 
            .mount('rest/v1/', appPath + "/v1/controllers/**/**.js") 
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }
}

new Server().start();
```