
<header class="symbol-info-header"><h1 id="session">Session</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Session }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/filters/decorators/session.ts#L0-L0">/common/filters/decorators/session.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Session</span><span class="token punctuation">(</span>expression?<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">any</span><span class="token punctuation">,</span> useType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->


Param | Type | Description
---|---|---
 expression|<code>string &#124; any</code>|Optional. The path of the property to get.
 useType|<code>any</code>|Optional. The type of the class that to be used to deserialize the data.




<!-- Description -->


### Description

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
> For more information on deserialization see [converters](docs/converters.md) page.

<!-- Members -->

