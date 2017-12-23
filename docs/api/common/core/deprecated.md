<header class="symbol-info-header">    <h1 id="deprecated">Deprecated</h1>    <label class="symbol-info-type-label function">Function</label>    <label class="api-type-label constructor">constructor</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Deprecated }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/core/decorators/deprecated.ts#L0-L0">                core/decorators/deprecated.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Deprecated</span><span class="token punctuation">(</span>message<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
function <span class="token function">Deprecated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>

### Description

The `@Deprecated()` decorators wraps the given method in such a way that it is marked as deprecated.

```typescript
provide Foo {

\@Deprecated("Foo.method: Use Foo.method2 instead")
public method() {

}
```

When called, @Deprecated() will return a function that will emit a `DeprecationWarning` using the `process.on('warning')` event.
By default, this warning will be emitted and printed to `stderr` exactly once, the first time it is called. After the warning is emitted, the wrapped method is called.

If either the `--no-deprecation` or `--no-warnings` command line flags are used, or if the `process.noDeprecation`
property is set to `true` prior to the first deprecation warning, the `@Deprecated()` decorators does nothing.

If the `--trace-deprecation` or `--trace-warnings` command line flags are set, or the `process.traceDeprecation`
property is set to `true`, a warning and a stack trace are printed to stderr the first time the deprecated function is called.

If the `--throw-deprecation` command line flag is set, or the `process.throwDeprecation` property is set to `true`,
then an exception will be thrown when the deprecated function is called.

The `--throw-deprecation` command line flag and `process.throwDeprecation` property take precedence over `--trace-deprecation`
and `process.traceDeprecation`.
