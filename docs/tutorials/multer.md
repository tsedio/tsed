---
sidebar: auto
meta:
 - name: description
   content: Use Multer with Express, TypeScript and Ts.ED. Node.js middleware for handling `multipart/form-data`.
 - name: keywords
   content: ts.ed express typescript multer node.js javascript decorators
---
# Multer
## Installation

Before using the @@MultipartFile@@ you must install [multer](https://github.com/expressjs/multer) and `@tsed/multipartfile` module on your project:

```bash
npm install --save multer @types/multer @tsed/multipartfiles
```

## Configure the File upload directory

By default the directory used is `${projetRoot}/uploads`. You can configure another directory on your Server settings.

<<< @/docs/tutorials/snippets/multer/configuration.ts

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

<<< @/docs/tutorials/snippets/multer/controller.ts

::: tip
Many frontend example code are available on the web and some of this doesn't works correctly. So here a short example:

<<< @/docs/tutorials/snippets/multer/loading-file.js

:::

For multiple files, just add Array type annotation like this:

<<< @/docs/tutorials/snippets/multer/file-array.ts

::: warning
Swagger spec (v2.0) doesn't support multiple files.
:::

::: tip
You can find a working example on [Multer here](https://github.com/TypedProject/tsed-example-multer).
:::
