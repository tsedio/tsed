---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ReturnsArray decorator
---
# ReturnsArray <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ReturnsArray }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/swagger/src/decorators/returnsArray.ts#L0-L0">/packages/swagger/src/decorators/returnsArray.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">ReturnsArray</span><span class="token punctuation">(</span>statusCode<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerResponses.html"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">ReturnsArray</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerResponses.html"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">ReturnsArray</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">ReturnsArray</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerResponses.html"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>




<!-- Params -->
Param | Type | Description
---|---|---
 statusCode|<code>number</code>|Code status  options|<code>&lt;a href="/api/swagger/interfaces/ISwaggerResponses.html"&gt;&lt;span class="token"&gt;ISwaggerResponses&lt;/span&gt;&lt;/a&gt;</code>|Swagger responses documentations 



<!-- Description -->
## Description

::: v-pre

Add responses documentation for a specific status code.

## Examples
## With status code

```typescript
 @ReturnsArray(200, {description: "OK", type: Model})
 async myMethod(): Promise<Model>  {

 }
```

This example will produce this documentation in swagger:

```json
{
  "responses": {
    "2OO": {
      "description": "Description",
      "schema": {"type": "array"}
    }
  }
}
```

### Without status code

ReturnsArray can be use without status code. In this case, the response will be added to the default status code
(200 or the status code seated with `@Status`).

```typescript
 @ReturnsArray({description: "Description"})
 async myMethod(): Promise<Model>  {

 }
```

This example will produce this documentation in swagger:

```json
{
  "responses": {
    "200": {
      "description": "Description",
      "schema": {"type": "array"}
    }
  }
}
```

### With type schema

ReturnsArray accept another signature with a type.

```typescript
 @ReturnsArray(Model, {description: "Description"}) //OR
 @ReturnsArray(Model)
 async myMethod(): Promise<Model>  {

 }
```

This example will produce this documentation in swagger:

```json
{
  "responses": {
    "200": {
      "description": "Description",
      "schema": {
        "type": "array",
        "items": {
          $ref: "Model"
        }
      }
    }
  }
}
```


:::