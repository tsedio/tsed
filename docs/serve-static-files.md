[Home](https://github.com/Romakita/ts-express-decorators/wiki) > Serve static files
> This feature is available since v1.4.x

`@ServerSettings` let you to configure a list of static folders. 

## Installation
Install the `serve-static` module:

```bash
npm install serve-static --save
```

Then configure your server:
```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");
const rootDir = Path.resolve(__dirname)

@ServerSettings({
   rootDir,
   serveStatic: {
      "/": `${rootDir}/webapp`
   }
})
export class Server extends ServerLoader {

}
```
> Note: serveStatic attributes supports multiple directories