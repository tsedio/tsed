# Serve static files

`@ServerSettings` let you to configure a list of static folders. 

### Configuration

Configure your server:

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
const rootDir = __dirname;

@ServerSettings({
   rootDir,
   statics: {
      "/": `${rootDir}/webapp`
   }
})
export class Server extends ServerLoader {

}
```
::: tip
serveStatic attributes supports multiple directories
:::
