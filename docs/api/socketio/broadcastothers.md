<header class="symbol-info-header">    <h1 id="broadcastothers">BroadcastOthers</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label experimental">experimental</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { BroadcastOthers }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/socketio"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/socketio/decorators/broadcastOthers.ts#L0-L0">                socketio/decorators/broadcastOthers.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">BroadcastOthers</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> PropertyDescriptor<span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>

### Description

Broadcast the response for all client registered in the same namespace except to the current client.

With the `@BroadcastOthers` decorator, the method will accept a return type (Promise or not).

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @Input("event")
  @BroadcastOthers("returnEvent")
  async myMethod(@Args(0) data: any, @Nsp socket): Promise<any> {
     return Promise.resolve({data})
  }
}
```
