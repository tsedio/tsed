# Serve static files

`@ServerSettings` let you to configure a list of static folders. 

### Installation
Install the `serve-static` module:

```bash
npm install serve-static --save
```

Then configure your server:
```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import "ts-express-decorators/servestatic";
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

<div class="guide-links">
<a href="#/tutorials/upload-file-with-multer">Upload files</a>
<a href="#/tutorials/templating">Templating</a>
</div>