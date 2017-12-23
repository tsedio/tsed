<header class="symbol-info-header">    <h1 id="socketsession">SocketSession</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label experimental">experimental</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { SocketSession }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/socketio"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/socketio/decorators/socketSession.ts#L0-L0">                socketio/decorators/socketSession.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">type SocketSession = Map<<span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">;</span>
function <span class="token function">SocketSession</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> index<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>

### Description

Inject the Socket instance in the decorated parameter.

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @Input("event")
  myMethod(@SocketSession session: Map) {

  }
}
```
