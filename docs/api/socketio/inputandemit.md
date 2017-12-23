<header class="symbol-info-header">    <h1 id="inputandemit">InputAndEmit</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label experimental">experimental</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { InputAndEmit }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/socketio"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/socketio/decorators/inputAndEmit.ts#L0-L0">                socketio/decorators/inputAndEmit.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">InputAndEmit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> PropertyDescriptor<span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>

### Description

Attach the decorated method to the socket event and emit the response to the client.

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @InputAndEmit("event")
  async myMethod(@Args(0) data: any, @Nsp socket) {
     return {data: "data"};
  }
}
```
