> Since v1.4.x, TsExpessDecorators support file uploading with Multer

### Installation

Before using the `@MultipartFile()` you must install [multer](https://github.com/expressjs/multer) module on your project:
```bash
npm install multer --save
```
You can install multer's file definitions via npm:
```bash
npm install @types/multer --save-dev
```
### Configure the File upload directory

By default the directory used is `${projetRoot}/uploads`. You can configure another directory on your `ServerLoader` settings.

```typescript
import {ServerLoader, ServerSettings} from "ts-express-decorators";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   uploadDir: `${rootDir}/custom-dir`,
   componentsScan: [
       `${rootDir}/services/**/**.js`
   ]
})
export class Server extends ServerLoader implements IServerLifecycle {

}
```

### Example 
TsExpressDecorators use multer to handler file uploads. Single file can be injected like this:

```typescript
@Controller('/')
class MyCtrl {
     @Post('/file')
     private uploadFile(@MultipartFile() file: Multer.File) {

     }
}
```
For multiple files, just add Array type annotation like this:
```typescript
@Controller('/')
class MyCtrl {
  @Post('/files')
     private uploadFile(@MultipartFile() files: Multer.File[]) {

     }
}
```
