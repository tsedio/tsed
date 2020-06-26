# Serve static files

`@ServerSettings` lets you configure a list of static folders. 

### Configuration

Configure your server:

```typescript
import {Configuration} from "@tsed/common";
const rootDir = __dirname;

@Configuration({
   rootDir,
   statics: {
      "/": `${rootDir}/webapp`
   }
})
export class Server {

}
```
::: tip
serveStatic attribute supports multiple directories
:::
