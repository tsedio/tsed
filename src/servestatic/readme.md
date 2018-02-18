# @tsed/servestatic

A package of Ts.ED framework. See website: https://romakita.github.io/ts-express-decorators/

## Installation

Install the `serve-static` module:

```bash
npm install --save serve-static @tsed/servestatic
```

Then import `@tsed/servestatic` in your [ServerLoader](api/common/server/serverloader.md):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/servestatic";
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