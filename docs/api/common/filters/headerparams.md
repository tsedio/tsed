<header class="symbol-info-header">    <h1 id="headerparams">HeaderParams</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { HeaderParams }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/filters/decorators/headerParams.ts#L0-L0">                filters/decorators/headerParams.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">HeaderParams</span><span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

Param | Type | Description
---|---|---
expression| <code>string</code> |The path of the property to get.


### Description

HeaderParams return the value from [request.params](http://expressjs.com/en/4x/api.html#req.params) object.

#### Example

```typescript
@Controller('/')
class MyCtrl {
   @Get('/')
   get(@Header() body: any) {
      console.log('Entire body', body);
   }

   @Get('/')
   get(@Header('x-token') token: string) {
      console.log('token', id);
   }
}
```
> For more information on deserialization see [converters](docs/converters.md) page.
