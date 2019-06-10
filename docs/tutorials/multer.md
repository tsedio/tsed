---
meta:
 - name: description
   content: Use Multer with Express, TypeScript and Ts.ED. Node.js middleware for handling `multipart/form-data`.
 - name: keywords
   content: ts.ed express typescript multer node.js javascript decorators
---
# Multer
## Installation

Before using the `@MultipartFile()` you must install [multer](https://github.com/expressjs/multer) and `@tsed/multipartfile` module on your project:

```bash
npm install --save multer @types/multer @tsed/multipartfiles
```

## Configure the File upload directory

By default the directory used is `${projetRoot}/uploads`. You can configure another directory on your `ServerLoader` settings.

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/multipartfiles";
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
   ],
   
   multer: {
       // see multer options
   }
})
export class Server extends ServerLoader {

}
```

## Options

- `dest` (`string`): The destination directory for the uploaded files.
- `storage` (`StoreEngine`): The storage engine to use for uploaded files.
- `limits` (`Object`): An object specifying the size limits of the following optional properties. This object is passed to busboy directly, and the details of properties can be found on [https://github.com/mscdex/busboy#busboy-methods]([https://github.com/mscdex/busboy#busboy-methods).
  - `fieldNameSize` (`number`): Max field name size (Default: 100 bytes).
  - `fieldSize` (`number`): Max field value size (Default: 1MB).
  - `fields` (`number`): Max number of non- file fields (Default: Infinity).
  - `fileSize` (`number`): For multipart forms, the max file size (in bytes)(Default: Infinity).
  - `files` (`number`): For multipart forms, the max number of file fields (Default: Infinity).
  - `parts` (`number`): For multipart forms, the max number of parts (fields + files)(Default: Infinity).
  - `headerPairs` (`number`): For multipart forms, the max number of header `key => value` pairs to parse Default: 2000(same as node's http).
  - `preservePath` (`boolean`): Keep the full path of files instead of just the base name (Default: false).


## Example 

Ts.ED use multer to handler file uploads. Single file can be injected like this:

```typescript
import {Controller, Post} from "@tsed/common";
import {MultipartFile, MulterOptions} from "@tsed/multipartfiles";

@Controller('/')
class MyCtrl {
    
  @Post('/file')
  private uploadFile(@MultipartFile('file') file: Express.Multer.File) {

  }
     
  @Post('/file')
  @MulterOptions({dest: "/other-dir"})
  private uploadFile(@MultipartFile('file') file: Express.Multer.File) {
         
  }
}
```

For multiple files, just add Array type annotation like this:
```typescript
import {Controller, Post} from "@tsed/common";
import {MultipartFile} from "@tsed/multipartfiles";

@Controller('/')
class MyCtrl {
  @Post('/files')
  private uploadFile(@MultipartFile("files", 4) files: Express.Multer.File[]) {
    // multiple files with 4 as limits
  }
}
```
::: warning
Swagger spec (v2.0) doesn't support multiple files.
:::

::: tip
You can find a working example on [Multer here](https://github.com/TypedProject/tsed-example-multer).
:::
