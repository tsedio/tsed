
<header class="symbol-info-header"><h1 id="returnsarray">ReturnsArray</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label swagger" title="swagger">swagger</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ReturnsArray }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/decorators/returnsArray.ts#L0-L0">/swagger/decorators/returnsArray.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">ReturnsArray</span><span class="token punctuation">(</span>statusCode<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="#api/swagger/iswaggerresponses"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">ReturnsArray</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="#api/swagger/iswaggerresponses"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">ReturnsArray</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">ReturnsArray</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="#api/swagger/iswaggerresponses"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->


Param | Type | Description
---|---|---
 statusCode|<code>number</code>|Code status
 options|<code><a href="#api/swagger/iswaggerresponses"><span class="token">ISwaggerResponses</span></a></code>|Swagger responses documentations




<!-- Description -->


### Description

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

<!-- Members -->

