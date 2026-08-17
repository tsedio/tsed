---
description: "Upload files with Ts.ED by using decorators."
head:
  - - meta
    - name: description
      content: Upload files with Ts.ED by using decorators. Ts.ED is built on top of Express/Koa and use TypeScript language.
  - - meta
    - name: keywords
      content: upload files ts.ed express typescript multer node.js javascript decorators
projects:
  - title: Kit Multer
    href: https://github.com/tsedio/tsed-example-multer
    src: /express.png
---

# Upload files

Ts.ED supports now the uploading files by default. We use [Multer](https://github.com/expressjs/multer) module
to handle `multipart/form-data` from request.

<Projects type="projects"/>

::: tip
Originally, multer is provided by Express.js, but Ts.ED implements a multer wrapper to support Koa.js platform based on the official [@koa/multer](https://www.npmjs.com/package/@koa/multer) module.
:::

## Configuration

By default, the directory used is `${projetRoot}/uploads`. You can configure another directory on your Server settings.

<<< @/docs/snippets/multer/configuration.ts

## Options

- `dest` (`string`): The destination directory for the uploaded files.
- `storage` (`StoreEngine`): The storage engine to use for uploaded files.
- `limits` (`Object`): An object specifying the size limits of the following optional properties. This object is passed to busboy directly, and the details of properties can be found on [https://github.com/mscdex/busboy](https://github.com/mscdex/busboy).
  - `fieldNameSize` (`number`): Max field name size (Default: 100 bytes).
  - `fieldSize` (`number`): Max field value size (Default: 1MB).
  - `fields` (`number`): Max number of non- file fields (Default: Infinity).
  - `fileSize` (`number`): For multipart forms, the max file size (in bytes)(Default: Infinity).
  - `files` (`number`): For multipart forms, the max number of file fields (Default: Infinity).
  - `parts` (`number`): For multipart forms, the max number of parts (fields + files)(Default: Infinity).
  - `headerPairs` (`number`): For multipart forms, the max number of header `key => value` pairs to parse Default: 2000(same as node's http).
- `preservePath` (`boolean`): Keep the full path of files instead of just the base name (Default: false).
- `fileFilter` (`Function`): Optional function to control which files are uploaded. This is called for every file that is processed.

## Usage

### Single file

A single file can be injected to your endpoint by using the @@MultipartFile@@ decorator like this:

<<< @/docs/snippets/multer/controller.ts

::: tip
Many frontend code examples are available on the web and some of them don't work as expected. So, to help you, here is a short vanilla Javascript code example:

<<< @/docs/snippets/multer/loading-file.js

:::

### Multiple files

For multiple files, just use `PlatformMulterFile[]` annotation type. Ts.ED will understand that you want to inject a list of files even if your consumer only sends you one:

<<< @/docs/snippets/multer/file-array.ts

## Middleware order and authentication

`PlatformMulterMiddleware` has a priority of `-10`. Lower priority values run first, so the upload middleware runs before
a middleware declared with `@UseBefore()` at the default priority (`0`).
This is intentional: it lets a `@UseBefore()` middleware access the uploaded file before the controller handler runs.

::: warning Authentication middleware
On an upload route, an authentication middleware with the default priority runs **after** Multer.
As a result, an unauthenticated request can start uploading a file before it is rejected.
Give the authentication middleware a priority lower than `-10` so it runs before Multer.
:::

For example, this controller uploads the file before `AuthMiddleware` checks the request:

```ts
import {Controller} from "@tsed/di";
import {UseBefore, Middleware} from "@tsed/platform-middlewares";
import {MultipartFile, PlatformMulterFile} from "@tsed/platform-multer";
import {Post} from "@tsed/schema";

@Middleware()
class AuthMiddleware {
  use() {
    // Check the request authentication
  }
}

@Controller("/files")
class FilesController {
  @Post("/")
  @UseBefore(AuthMiddleware)
  upload(@MultipartFile("file") file: PlatformMulterFile) {
    return file;
  }
}
```

Set the middleware priority to `-11` (or any value lower than `-10`) to authenticate the request before the file is handled by Multer:

```ts
import {Middleware} from "@tsed/platform-middlewares";

@Middleware({priority: -11})
class AuthMiddleware {
  use() {
    // Check the request authentication before the upload starts
  }
}
```

Use `-10` only when the authentication middleware's relative order with `PlatformMulterMiddleware`
is otherwise explicitly controlled. A lower value is the reliable choice when authentication must happen before an upload.
