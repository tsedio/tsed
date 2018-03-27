
<header class="symbol-info-header"><h1 id="multipartfile">MultipartFile</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label multer" title="multer">multer</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MultipartFile }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/multipartfiles"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//multipartfiles/decorators/multipartFile.ts#L0-L0">/multipartfiles/decorators/multipartFile.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">MultipartFile</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> multer.Options<span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Define a parameter as Multipart file.

```typescript
import {Controller, Post} from "@tsed/common";
import {Multer} from "@types/multer";

type MulterFile = Express.Multer.File;

@Controller('/')
class MyCtrl {
  @Post('/file')
  private uploadFile(@MultipartFile() file: MulterFile) {

  }

  @Post('/file')
  private uploadFile(@MultipartFile({dest: "/other-dir"}) file: MulterFile) {

  }

  @Post('/files')
  private uploadFile(@MultipartFile() files: MulterFile[]) {

  }
}
```

> See the tutorial on the [multer configuration](tutorials/upload-files-with-multer.md).

<!-- Members -->

