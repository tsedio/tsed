<header class="symbol-info-header">    <h1 id="nsp">Nsp</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label experimental">experimental</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Nsp }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/socketio"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/socketio/decorators/nsp.ts#L0-L0">                socketio/decorators/nsp.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Nsp</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> index?<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>

### Description

Inject the [SocketIO.Namespace](https://socket.io/docs/rooms-and-namespaces/#namespaces) instance in the decorated parameter.

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @Nsp
  nsp: SocketIO.Namespace; // will inject SocketIO.Namespace (not available on constructor)

  @Input("event")
  myMethod(@Nsp namespace: SocketIO.Namespace) {

  }
}
```
