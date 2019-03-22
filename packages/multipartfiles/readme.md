# @tsed/multipartfiles

A package of Ts.ED framework. See website: https://tsed.io/#/tutorials/upload-file-with-multer

## Installation

Before using the `@MultipartFile()` you must install [multer](https://github.com/expressjs/multer) module on your project:

```bash
npm install --save @types/multer @tsed/multipartfiles
```

Then import `@tsed/multipartfiles` in your [ServerLoader](https://tsed.io/api/common/server/components/ServerLoader.html):

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "@tsed/ajv"; // import ajv ts.ed module
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir: __dirname,
   uploadDir: `${rootDir}/custom-dir`,                                    
   multer: {
      // see multer options
   }
})
export class Server extends ServerLoader {

}
```

> By default the directory used is `${projetRoot}/uploads`. You can configure another directory on your `ServerLoader` settings.


## Options

- `dest` (`string`): The destination directory for the uploaded files.
- `storage` (`StoreEngine): The storage engine to use for uploaded files.
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
import {Multer} from "@types/multer";
import {MultipartFile, MulterOptions} from "@tsed/multipartfiles";


type MulterFile = Express.Multer.File;

@Controller('/')
class MyCtrl {
    
  @Post('/file')
  private uploadFile(@MultipartFile("file") file: MulterFile) {

  }
     
  @Post('/file')
  @MulterOptions({dest: "/other-dir"})
  private uploadFile(@MultipartFile("file") file: MulterFile) {
         
  }

  @Post('/file')
  @MulterOptions({dest: "/other-dir"})
  @MulterFileSize(1024) // (unit: Ko). Applied for all fields
  private uploadFile(@MultipartFile("file1") file1: MulterFile, @MultipartFile("file2") file2: MulterFile) {

  }
}
```

For multiple files, just add Array type annotation like this:

```typescript
import {Controller, Post} from "@tsed/common";
import {Multer} from "multer";
import {MultipartFile, MulterOptions} from "@tsed/multipartfiles";

type MulterFile = Express.Multer.File;

@Controller('/')
class MyCtrl {
  @Post('/files')
  @MulterOptions({dest: "/other-dir"})
  private uploadFile(@MultipartFile("files", 4) files: MulterFile[]) {
      // multiple files with 4 as limits
  }
}
```

## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2018 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
