<header class="symbol-info-header">    <h1 id="service">Service</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label constructor">constructor</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Service }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/di/decorators/service.ts#L0-L0">                di/decorators/service.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Service</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

The decorators `@Service()` a new service can be injected in other service or controller on there `constructor`.
All services annotated with `@Service()` are constructed one time.

> `@Service()` use the `reflect-metadata` to collect and inject service on controllers or other services.
