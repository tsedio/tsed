<header class="symbol-info-header">    <h1 id="socketservice">SocketService</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label experimental">experimental</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { SocketService }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/socketio"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/socketio/decorators/socketService.ts#L0-L0">                socketio/decorators/socketService.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">SocketService</span><span class="token punctuation">(</span>namespace?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

The decorators `@SocketService()` a new socket service (and service) can be injected in other service or controller on there `constructor`.
All services annotated with `@SocketService()` are constructed one time.

> `@SocketService()` use the `reflect-metadata` to collect and inject service on controllers or other services.
