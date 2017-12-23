<header class="symbol-info-header">    <h1 id="bootstrap">bootstrap</h1>    <label class="symbol-info-type-label function">Function</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { bootstrap }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/testing"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/testing/bootstrap.ts#L0-L0">                testing/bootstrap.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">bootstrap</span><span class="token punctuation">(</span>server<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>done<span class="token punctuation">:</span> Function<span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>

### Description

Load the server silently without listening port and configure it on test profile.
