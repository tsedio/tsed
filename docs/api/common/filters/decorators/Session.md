---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Session decorator
---
# Session <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Session }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/filters/decorators/session.ts#L0-L0">/common/filters/decorators/session.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Session</span><span class="token punctuation">(</span>expression?<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">any</span><span class="token punctuation">,</span> useType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><a href="/api/common/filters/components/SessionFilter.html"><span class="token">SessionFilter</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    expression<span class="token punctuation">,</span>
    useType<span class="token punctuation">,</span>
    paramType<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.SESSION
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>




<!-- Params -->
Param | Type | Description
---|---|---
 expression|<code>string &#124; any</code>|Optional. The path of the property to get.  useType|<code>any</code>|Optional. The type of the class that to be used to deserialize the data. 



<!-- Description -->
## Description

::: v-pre

Session return the value from [request.session](http://expressjs.com/en/4x/api.html#req.session) object.

#### Example

```typescript
@Controller('/')
class MyCtrl {
   @Post('/')
   create(@Session() session: any) {
      console.log('Entire session', session);
   }

   @Post('/')
   create(@Session('id') id: string) {
      console.log('ID', id);
   }

   @Post('/')
   create(@Session() session: Session) { // with deserialization
      console.log('session', session);
   }
}
```
> For more information on deserialization see [converters](/docs/converters.md) page.


:::