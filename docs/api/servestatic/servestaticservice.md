<header class="symbol-info-header">    <h1 id="servestaticservice">ServeStaticService</h1>    <label class="symbol-info-type-label service">Service</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ServeStaticService }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/servestatic"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/servestatic/services/ServeStaticService.ts#L0-L0">                servestatic/services/ServeStaticService.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang"><span class="token keyword">class</span> ServeStaticService <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>expressApp<span class="token punctuation">:</span> Express.Application<span class="token punctuation">,</span> serverSettingsService<span class="token punctuation">:</span> <a href="#api/common/serversettingsservice"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    $<span class="token function">afterRoutesInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">mount</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> directory<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>

### Members

<div class="method-overview"><pre><code class="typescript-lang">$<span class="token function">afterRoutesInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre></div>
<hr />
<div class="method-overview"><pre><code class="typescript-lang"><span class="token function">mount</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> directory<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre></div>
