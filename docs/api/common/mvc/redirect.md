<header class="symbol-info-header">    <h1 id="redirect">Redirect</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Redirect }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/mvc/decorators/method/redirect.ts#L0-L0">                mvc/decorators/method/redirect.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Redirect</span><span class="token punctuation">(</span>status<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span><span class="token punctuation">,</span> location?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an HTTP status code . If not specified, status defaults to “302 “Found”.

```typescript
 @Redirect('/foo/bar')
 @Redirect(301, 'http://example.com')
 private myMethod() {}
```
Redirects can be a fully-qualified URL for redirecting to a different site:

```typescript
 @Redirect('http://google.com');
 private myMethod() {}
```

Redirects can be relative to the root of the host name. For example, if the application is on http://example.com/admin/post/new, the following would redirect to the URL http://example.com/admin:

```typescript
 @Redirect('/admin');
```
Redirects can be relative to the current URL. For example, from http://example.com/blog/admin/ (notice the trailing slash), the following would redirect to the URL http://example.com/blog/admin/post/new.

```typescript
 @Redirect('post/new');
```

Redirecting to post/new from http://example.com/blog/admin (no trailing slash), will redirect to http://example.com/blog/post/new.

If you found the above behavior confusing, think of path segments as directories (with trailing slashes) and files, it will start to make sense.

Path-relative redirects are also possible. If you were on http://example.com/admin/post/new, the following would redirect to http//example.com/admin/post:

```typescript
 @Redirect('..');
``

A back redirection redirects the request back to the referer, defaulting to / when the referer is missing.

```typescript
 @Redirect('back');
```

@param status
@param location
@returns {Function}
@decorator
