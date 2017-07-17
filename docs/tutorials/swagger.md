# Swagger

### Installation

Before using the Swagger you must install [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) module on your project:
```bash
npm install --save swagger-ui-express
```
Then add the following configuration in your [ServerLoader](api/common/server/serverloader.md):

```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import "ts-express-decorators/swagger"; // import swagger ts.ed module

@ServerSettings({
    rootDir: __dirname,
    swagger: {
        path: "/api-docs"
    }
})
export class Server extends ServerLoader {

}
```

### Swagger options


Key | Example | Description
---|---|---
path | `/api-doc` |  The url subpath to access to the documentation. 
cssPath | `${rootDir}/spec/style.css` | The path to the CSS file.
showExplorer | `true` | Display the search field in the navbar. 
spec |  `{swagger: "2.0"}` | The default information spec. 
specPath | `${rootDir}/spec/swagger.json` | The path to the swagger.json. This file will be written at the first server starting if it doesn't exist. The data will me merge with the collected data via annotation. 


