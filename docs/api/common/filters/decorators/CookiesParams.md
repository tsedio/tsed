---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation CookiesParams decorator
---
# CookiesParams <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { CookiesParams }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/filters/decorators/cookies.ts#L0-L0">/common/filters/decorators/cookies.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">CookiesParams</span><span class="token punctuation">(</span>expression?<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">any</span><span class="token punctuation">,</span> useType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><a href="/api/common/filters/components/CookiesFilter.html"><span class="token">CookiesFilter</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>
    expression<span class="token punctuation">,</span>
    useType<span class="token punctuation">,</span>
    paramType<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.COOKIES
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 * <a href="/api/common/filters/decorators/Cookies.html"><span class="token">Cookies</span></a> o CookiesParams return the value <span class="token keyword">from</span> <span class="token punctuation">[</span>request.cookies<span class="token punctuation">]</span><span class="token punctuation">(</span>http<span class="token punctuation">:</span>//expressjs.com/en/4x/api.html#req.cookies<span class="token punctuation">)</span> object.
 *
 * #### <a href="/api/swagger/decorators/Example.html"><span class="token">Example</span></a>
 *
 * ```typescript
 * @<span class="token function"><a href="/api/common/mvc/decorators/class/Controller.html"><span class="token">Controller</span></a></span><span class="token punctuation">(</span>'/'<span class="token punctuation">)</span>
 * <span class="token keyword">class</span> MyCtrl <span class="token punctuation">{</span>
 *    @<span class="token function"><a href="/api/common/mvc/decorators/method/Post.html"><span class="token">Post</span></a></span><span class="token punctuation">(</span>'/'<span class="token punctuation">)</span>
 *    <span class="token function">create</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Cookies.html"><span class="token">Cookies</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> body<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 *       console.<span class="token function">log</span><span class="token punctuation">(</span>'Entire body'<span class="token punctuation">,</span> body<span class="token punctuation">)</span><span class="token punctuation">;</span>
 *    <span class="token punctuation">}</span>
 *
 *    @<span class="token function"><a href="/api/common/mvc/decorators/method/Post.html"><span class="token">Post</span></a></span><span class="token punctuation">(</span>'/'<span class="token punctuation">)</span>
 *    <span class="token function">create</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Cookies.html"><span class="token">Cookies</span></a></span><span class="token punctuation">(</span>'id'<span class="token punctuation">)</span> id<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 *       console.<span class="token function">log</span><span class="token punctuation">(</span>'ID'<span class="token punctuation">,</span> id<span class="token punctuation">)</span><span class="token punctuation">;</span>
 *    <span class="token punctuation">}</span>
 *
 *    @<span class="token function"><a href="/api/common/mvc/decorators/method/Post.html"><span class="token">Post</span></a></span><span class="token punctuation">(</span>'/'<span class="token punctuation">)</span>
 *    <span class="token function">create</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Cookies.html"><span class="token">Cookies</span></a></span><span class="token punctuation">(</span>'user'<span class="token punctuation">)</span> user<span class="token punctuation">:</span> User<span class="token punctuation">)</span> <span class="token punctuation">{</span> // with deserialization
 *       console.<span class="token function">log</span><span class="token punctuation">(</span>'user'<span class="token punctuation">,</span> user<span class="token punctuation">)</span><span class="token punctuation">;</span>
 *    <span class="token punctuation">}</span>
 *
 *    @<span class="token function"><a href="/api/common/mvc/decorators/method/Post.html"><span class="token">Post</span></a></span><span class="token punctuation">(</span>'/'<span class="token punctuation">)</span>
 *    <span class="token function">create</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Cookies.html"><span class="token">Cookies</span></a></span><span class="token punctuation">(</span>'users'<span class="token punctuation">,</span> User<span class="token punctuation">)</span> users<span class="token punctuation">:</span> User<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> // with deserialization
 *       console.<span class="token function">log</span><span class="token punctuation">(</span>'users'<span class="token punctuation">,</span> users<span class="token punctuation">)</span><span class="token punctuation">;</span>
 *    <span class="token punctuation">}</span>
 * <span class="token punctuation">}</span>
 * ```
 * &gt<span class="token punctuation">;</span> For more information on deserialization see <span class="token punctuation">[</span>converters<span class="token punctuation">]</span><span class="token punctuation">(</span>/docs/converters.md<span class="token punctuation">)</span> page.
 *
 * @param expression The path of the property to get.
 * @param useType The type of the <span class="token keyword">class</span> that to be used to deserialize the data.
 * @decorator
 * @aliasof CookiesParams
 * @returns <span class="token punctuation">{</span>Function<span class="token punctuation">}</span>
 */</code></pre>




<!-- Params -->
Param | Type | Description
---|---|---
 expression|<code>string &#124; any</code>|Optional. The path of the property to get.  useType|<code>any</code>|Optional. The type of the class that to be used to deserialize the data. 



<!-- Description -->
## Description

::: v-pre

Cookies o CookiesParams return the value from [request.cookies](http://expressjs.com/en/4x/api.html#req.cookies) object.

#### Example

```typescript
@Controller('/')
class MyCtrl {
   @Post('/')
   create(@Cookies() cookies: any) {
      console.log('Entire cookies', cookies);
   }

   @Post('/')
   create(@Cookies('id') id: string) {
      console.log('ID', id);
   }

   @Post('/')
   create(@Cookies('user') user: User) { // with deserialization
      console.log('user', user);
   }

   @Post('/')
   create(@Cookies('users', User) users: User[]) { // with deserialization
      console.log('users', users);
   }
}
```
> For more information on deserialization see [converters](/docs/converters.md) page.


:::