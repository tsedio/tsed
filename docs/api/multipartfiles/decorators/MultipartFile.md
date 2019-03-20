---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MultipartFile decorator
---
# MultipartFile <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MultipartFile }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/multipartfiles"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/multipartfiles/src/decorators/multipartFile.ts#L0-L0">/packages/multipartfiles/src/decorators/multipartFile.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MultipartFile</span><span class="token punctuation">(</span>name?<span class="token punctuation">:</span> <span class="token keyword">string</span> | multer.Options<span class="token punctuation">,</span> maxCount?<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Define a parameter as Multipart file.

```typescript
import {Controller, Post} from "@tsed/common";
import {MulterOptions, MultipartFile} from "@tsed/multipartfiles";
import {Multer} from "@types/multer";

type MulterFile = Express.Multer.File;

@Controller('/')
class MyCtrl {
  @Post('/file')
  private uploadFile(@MultipartFile("file1") file: MulterFile) {

  }

  @Post('/file')
  @MulterOptions({dest: "/other-dir"})
  private uploadFile(@MultipartFile("file1") file: MulterFile) {

  }

  @Post('/file2')
  @MulterOptions({dest: "/other-dir"})
  private uploadFile(@MultipartFile("file1") file: MulterFile, @MultipartFile("file2") file2: MulterFile) {

  }

  @Post('/files')
  private uploadFile(@MultipartFile("file1") files: MulterFile[]) {

  }
}
```

> See the tutorial on the [multer configuration](/tutorials/multer.md).


:::