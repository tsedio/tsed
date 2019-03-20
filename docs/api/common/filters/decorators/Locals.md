---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Locals decorator
---
# Locals <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Locals }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/filters/decorators/locals.ts#L0-L0">/packages/common/src/filters/decorators/locals.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Locals</span><span class="token punctuation">(</span>expression?<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>




<!-- Params -->
Param | Type | Description
---|---|---
 expression|<code>string &#124; any</code>|Optional. The path of the property to get. 



<!-- Description -->
## Description

::: v-pre

Locals return the value from [response.locals](http://expressjs.com/en/4x/api.html#res.locals) object.

#### Example

```typescript
@Controller('/')
class MyCtrl {
   @Get('/')
   get(@Locals() locals: any) {
      console.log('Entire locals', locals);
   }

   @Get('/')
   get(@Locals('user') user: any) {
      console.log('user', user);
   }
}
```
> For more information on deserialization see [converters](/docs/converters.md) page.


:::