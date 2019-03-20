---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Strict decorator
---
# Strict <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Strict }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/decorators/class/strict.ts#L0-L0">/packages/common/src/mvc/decorators/class/strict.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Strict</span><span class="token punctuation">(</span>strict<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Specify the behavior of the router controller.

```typescript
@Controller("/")
@Strict(true)
class MyCtrl {

}
```

Property | Description |    Default
---|---|---
CaseSensitive | Enable case sensitivity. | Disabled by default, treating “/Foo” and “/foo” as the same.
MergeParams | Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence. | false
Strict | Enable strict routing. | Disabled by default, “/foo” and “/foo/” are treated the same by the router.


:::