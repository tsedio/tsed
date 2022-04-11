---
meta:
  - name: description
    content: Upload files with Ts.ED by using decorators. Ts.ED is built on top of Express/Koa and use TypeScript language.
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

<Tabs class="-code">
  <Tab label="Configuration" icon="bx-code-alt">

<<< @/tutorials/snippets/multer/configuration.ts

  </Tab>
  <Tab label="CodeSandbox" icon="bxl-codepen">

<CodeSandbox sandboxId="rough-frost-6bi81" title="Multer example" />

  </Tab>
</Tabs>

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

<<< @/tutorials/snippets/multer/controller.ts

::: tip
Many frontend code examples are available on the web and some of them don't work as expected. So, to help you, here is a short vanilla Javascript code example:

<<< @/tutorials/snippets/multer/loading-file.js

:::

### Multiple files

For multiple files, just use `PlatformMulterFile[]` annotation type. Ts.ED will understand that you want to inject a list of files even if your consumer only sends you one:

<<< @/tutorials/snippets/multer/file-array.ts

::: warning
Swagger spec (v2.0) doesn't support multiple files. Enable OAS 3 to support multipart files in swagger-ui.
:::
