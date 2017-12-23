<header class="symbol-info-header">    <h1 id="format">Format</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Format }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/format.ts#L0-L0">                ajv/decorators/format.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Format</span><span class="token punctuation">(</span>format<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

The following formats are supported for string validation with `format` keyword:

- **date**: full-date according to RFC3339.
- **time**: time with optional time-zone.
- **date-time**: date-time from the same source (time-zone is mandatory). date, time and date-time validate ranges in full mode and only regexp in fast mode (see options).
- **uri**: full uri with optional protocol.
- **url**: URL record.
- **uri-template**: URI template according to RFC6570
- **email**: email address.
- **hostname**: host name according to RFC1034.
- **ipv4**: IP address v4.
- **ipv6**: IP address v6.
- **regex**: tests whether a string is a valid regular expression by passing it to RegExp constructor.
- **uuid**: Universally Unique IDentifier according to RFC4122.
- **json-pointer**: JSON-pointer according to RFC6901.
- **relative-json-pointer**: relative JSON-pointer according to this draft.
