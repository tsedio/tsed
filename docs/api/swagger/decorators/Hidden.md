---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Hidden decorator
---
# Hidden <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Hidden }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/swagger/src/decorators/hidden.ts#L0-L0">/packages/swagger/src/decorators/hidden.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Hidden</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Hide a route or all route under in the decorated controller from the documentation.

````typescript
@Controller('/')
export class Ctrl {

  @Get('/')
  @Hidden()
  hiddenRoute(){

  }
}

@Controller('/')
@Hidden()
export class Ctrl {
  @Get('/')
  hiddenRoute() {

  }
  @Get('/2')
  hiddenRoute2() {

  }
}

@Controller('/')
export class Ctrl {
  @Get('/')
  hiddenRoute(@Hidden() @QueryParams() param: string){

  }
}
```


:::