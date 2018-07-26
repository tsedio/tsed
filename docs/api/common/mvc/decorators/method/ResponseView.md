---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ResponseView decorator
---
# ResponseView <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ResponseView }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/method/responseView.ts#L0-L0">/common/mvc/decorators/method/responseView.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">ResponseView</span><span class="token punctuation">(</span>viewPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> viewOptions?<span class="token punctuation">:</span> Object<span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><span class="token punctuation">(</span>store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    store.<span class="token function">set</span><span class="token punctuation">(</span><a href="/api/common/mvc/components/ResponseViewMiddleware.html"><span class="token">ResponseViewMiddleware</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>viewPath<span class="token punctuation">,</span> viewOptions<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    return <span class="token function"><a href="/api/common/mvc/decorators/method/UseAfter.html"><span class="token">UseAfter</span></a></span><span class="token punctuation">(</span><a href="/api/common/mvc/components/ResponseViewMiddleware.html"><span class="token">ResponseViewMiddleware</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 * Renders a view and sends the rendered HTML <span class="token keyword">string</span> to the client. Optional parameter<span class="token punctuation">:</span>
 *
 * * viewOptions<span class="token punctuation">,</span> an object whose properties define local variables for the view.
 *
 * The view argument is a <span class="token keyword">string</span> that is the file path of the view file to render.
 * This can be an absolute path<span class="token punctuation">,</span> or a path relative to the views setting.
 * If the path does not contain a file extension<span class="token punctuation">,</span> then the view engine setting determines the file extension.
 * If the path does contain a file extension<span class="token punctuation">,</span> then Express will load the module for the specified template engine <span class="token punctuation">(</span>via <span class="token function">require</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
 * and render it using the loaded module’s __express function.
 *
 * For more information<span class="token punctuation">,</span> see <span class="token punctuation">[</span>Using template engines with Express<span class="token punctuation">]</span><span class="token punctuation">(</span>http<span class="token punctuation">:</span>//expressjs.com/guide/using-template-engines.html<span class="token punctuation">)</span>.
 *
 * &gt<span class="token punctuation">;</span> NOTE<span class="token punctuation">:</span> The view argument performs file system operations like reading a file <span class="token keyword">from</span> disk and evaluating Node.js modules<span class="token punctuation">,</span>
 * and <span class="token keyword">as</span> so for security reasons should not contain input <span class="token keyword">from</span> the end-user.
 *
 * @param viewPath
 * @param viewOptions
 * @returns <span class="token punctuation">{</span>Function<span class="token punctuation">}</span>
 * @decorator
 * @alias ResponseView
 */</code></pre>



<!-- Description -->
## Description

::: v-pre

Renders a view and sends the rendered HTML string to the client. Optional parameter:

* viewOptions, an object whose properties define local variables for the view.

The view argument is a string that is the file path of the view file to render.
This can be an absolute path, or a path relative to the views setting.
If the path does not contain a file extension, then the view engine setting determines the file extension.
If the path does contain a file extension, then Express will load the module for the specified template engine (via require())
and render it using the loaded module’s __express function.

For more information, see [Using template engines with Express](http://expressjs.com/guide/using-template-engines.html).

> NOTE: The view argument performs file system operations like reading a file from disk and evaluating Node.js modules,
and as so for security reasons should not contain input from the end-user.


:::