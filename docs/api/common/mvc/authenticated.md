<header class="symbol-info-header">    <h1 id="authenticated">Authenticated</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Authenticated }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/mvc/decorators/method/authenticated.ts#L0-L0">                mvc/decorators/method/authenticated.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Authenticated</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

Set authentication strategy on your endpoint.

```typescript
@ControllerProvider('/mypath')
class MyCtrl {

  @Get('/')
  @Authenticated({role: 'admin'})
  public getResource(){}
}
```
