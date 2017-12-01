# Versioning REST API

Ts.ED provide the possibility to mount multiple Rest path instead of the default path `/rest`.
You have two methods to configure all global endpoints for each directories scanned by the [ServerLoader](api/common/server/serverloader.md).

### With decorator (Recommended)

```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir,
   mount: {
     "/rest": "${rootDir}/controllers/current/**/*.js",
     "/rest/v1": [
        "${rootDir}/controllers/v1/users/*.js", 
        "${rootDir}/controllers/v1/groups/*.js"
     ]
   }
})
export class Server extends ServerLoader {

}

new Server().start();
```
> Note: mount attribute accept a list of glob for each endpoint. That lets you declare a resource versioning.

### With ServerLoader API

```typescript
import {ServerLoader, IServerLifecycle} from "ts-express-decorators";
import Path = require("path");

export class Server extends ServerLoader implements IServerLifecycle {

    constructor() {
        super();

        const appPath: string = Path.resolve(__dirname);

        this.mount('rest/', appPath + "/controllers/**/**.js") 
            .mount('rest/v1/', [
                appPath + "/controllers/v1/users/**.js",
                appPath + "/controllers/v1/groups/**.js"
            ]) 
            .createHttpServer(8000)
            .createHttpsServer({
                port: 8080
            });

    }
}

new Server().start();
```

<div class="guide-links">
<a href="#/docs/server-loader/lifecycle-hooks">ServerLoader</a>
<a href="#/docs/testing">Testing</a>
</div>
