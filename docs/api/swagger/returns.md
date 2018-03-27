
<header class="symbol-info-header"><h1 id="returns">Returns</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label swagger" title="swagger">swagger</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Returns }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/decorators/returns.ts#L0-L0">/swagger/decorators/returns.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Returns</span><span class="token punctuation">(</span>statusCode<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="#api/swagger/iswaggerresponses"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">Returns</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="#api/swagger/iswaggerresponses"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">Returns</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">Returns</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="#api/swagger/iswaggerresponses"><span class="token">ISwaggerResponses</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


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
 @Returns(404, {description: "Not found"})
 @Returns(200, {description: "OK", type: Model})
 async myMethod(): Promise<Model>  {

 }
```

This example will produce this documentation in swagger:

```json
{
  "responses": {
    "404": {
      "description": "Description"
    },
    "2OO": {
      "description": "Description",
      "schema": {"schemaOfModel": "..."}
    }
  }
}
```

### Without status code

Returns can be use without status code. In this case, the response will be added to the default status code
(200 or the status code seated with `@Status`).

```typescript
 @Returns({description: "Description"})
 async myMethod(): Promise<Model>  {

 }
```

This example will produce this documentation in swagger:

```json
{
  "responses": {
    "200": {
      "description": "Description"
    }
  }
}
```

### With type schema

Returns accept another signature with a type.

```typescript
 @Returns(Model, {description: "Description"}) //OR
 @Returns(Model)
 async myMethod(): Promise<Model>  {

 }
```

This example will produce this documentation in swagger:

```json
{
  "responses": {
    "200": {
      "description": "Description",
      "schema": {"schemaOfModel": "..."}
    }
  }
}
```

<!-- Members -->

