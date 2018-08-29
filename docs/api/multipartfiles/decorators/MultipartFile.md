---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MultipartFile decorator
---
# MultipartFile <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MultipartFile }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/multipartfiles"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//multipartfiles/decorators/multipartFile.ts#L0-L0">/multipartfiles/decorators/multipartFile.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MultipartFile</span><span class="token punctuation">(</span>name?<span class="token punctuation">:</span> <span class="token keyword">string</span> | multer.Options<span class="token punctuation">,</span> maxCount?<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> parameterIndex<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> type<span class="token punctuation"> = </span><span class="token function">getDecoratorType</span><span class="token punctuation">(</span><span class="token punctuation">[</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> parameterIndex<span class="token punctuation">]</span><span class="token punctuation">,</span> true<span class="token punctuation">)</span><span class="token punctuation">;</span>

    switch <span class="token punctuation">(</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      default<span class="token punctuation">:</span>
        throw new <span class="token function">Error</span><span class="token punctuation">(</span>"MultipartFile is only supported on parameters"<span class="token punctuation">)</span><span class="token punctuation">;</span>

      case "parameter"<span class="token punctuation">:</span>
        <span class="token keyword">const</span> store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token function">fromMethod</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">const</span> multiple<span class="token punctuation"> = </span><a href="/api/core/class/Metadata.html"><span class="token">Metadata</span></a>.<span class="token function">getParamTypes</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">[</span>parameterIndex<span class="token punctuation">]</span> === Array<span class="token punctuation">;</span>
        <span class="token keyword">const</span> options<span class="token punctuation"> = </span>typeof name === <span class="token string">"object"</span> ? name <span class="token punctuation">:</span> undefined<span class="token punctuation">;</span>
        <span class="token keyword">const</span> added<span class="token punctuation"> = </span>store.<span class="token function">has</span><span class="token punctuation">(</span>"multipartAdded"<span class="token punctuation">)</span><span class="token punctuation">;</span>

        name<span class="token punctuation"> = </span><span class="token punctuation">(</span>typeof name === <span class="token string">"object"</span> ? undefined <span class="token punctuation">:</span> name<span class="token punctuation">)</span>!<span class="token punctuation">;</span>

        // create endpoint metadata
        store.<span class="token function">merge</span><span class="token punctuation">(</span>"consumes"<span class="token punctuation">,</span> <span class="token punctuation">[</span>"multipart/form-data"<span class="token punctuation">]</span><span class="token punctuation">)</span>.<span class="token function">set</span><span class="token punctuation">(</span>"multipartAdded"<span class="token punctuation">,</span> true<span class="token punctuation">)</span><span class="token punctuation">;</span>
        store
          .<span class="token function">merge</span><span class="token punctuation">(</span>"responses"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
            "400"<span class="token punctuation">:</span> <span class="token punctuation">{</span>
              description<span class="token punctuation">:</span> `&lt<span class="token punctuation">;</span>File too long | Too many parts | Too many files | Field name too long | Field value too long | Too many fields | Unexpected field&gt<span class="token punctuation">;</span>  <span class="token punctuation">[</span>fieldName<span class="token punctuation">]</span>
                            <a href="/api/swagger/decorators/Example.html"><span class="token">Example</span></a><span class="token punctuation">:</span> File too long file1`
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span>
          .<span class="token function">set</span><span class="token punctuation">(</span>"multipartAdded"<span class="token punctuation">,</span> true<span class="token punctuation">)</span><span class="token punctuation">;</span>

        if <span class="token punctuation">(</span>!added<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          // middleware is added
          <span class="token function"><a href="/api/common/mvc/decorators/method/UseBefore.html"><span class="token">UseBefore</span></a></span><span class="token punctuation">(</span><a href="/api/multipartfiles/middlewares/MultipartFileMiddleware.html"><span class="token">MultipartFileMiddleware</span></a><span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> <span class="token function">descriptorOf</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        if <span class="token punctuation">(</span>name === undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          store.<span class="token function">merge</span><span class="token punctuation">(</span><a href="/api/multipartfiles/middlewares/MultipartFileMiddleware.html"><span class="token">MultipartFileMiddleware</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>
            options<span class="token punctuation">,</span>
            <span class="token keyword">any</span><span class="token punctuation">:</span> true
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

          <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">useFilter</span><span class="token punctuation">(</span>multiple ? <a href="/api/multipartfiles/components/MultipartFilesFilter.html"><span class="token">MultipartFilesFilter</span></a> <span class="token punctuation">:</span> <a href="/api/multipartfiles/components/MultipartFileFilter.html"><span class="token">MultipartFileFilter</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>
            propertyKey<span class="token punctuation">,</span>
            parameterIndex<span class="token punctuation">,</span>
            target<span class="token punctuation">,</span>
            useConverter<span class="token punctuation">:</span> false<span class="token punctuation">,</span>
            paramType<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.FORM_DATA
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
          <span class="token keyword">const</span> expression<span class="token punctuation"> = </span>multiple ? <span class="token punctuation">(</span>name <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">:</span> name + ".0"<span class="token punctuation">;</span>

          store.<span class="token function">merge</span><span class="token punctuation">(</span><a href="/api/multipartfiles/middlewares/MultipartFileMiddleware.html"><span class="token">MultipartFileMiddleware</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>
            fields<span class="token punctuation">:</span> <span class="token punctuation">[</span>
              <span class="token punctuation">{</span>
                name<span class="token punctuation">,</span>
                maxCount
              <span class="token punctuation">}</span>
            <span class="token punctuation">]</span><span class="token punctuation">,</span>
            options
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

          <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">useFilter</span><span class="token punctuation">(</span><a href="/api/multipartfiles/components/MultipartFilesFilter.html"><span class="token">MultipartFilesFilter</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>
            expression<span class="token punctuation">,</span>
            propertyKey<span class="token punctuation">,</span>
            parameterIndex<span class="token punctuation">,</span>
            target<span class="token punctuation">,</span>
            useConverter<span class="token punctuation">:</span> false<span class="token punctuation">,</span>
            paramType<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.FORM_DATA
          <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        break<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



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