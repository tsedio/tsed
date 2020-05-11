# Serve static files

`@ServerSettings` lets you configure a list of static folders. 

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
serveStatic attribute supports multiple directories
:::
