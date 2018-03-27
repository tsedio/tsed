
<header class="symbol-info-header"><h1 id="hidden">Hidden</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label swagger" title="swagger">swagger</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Hidden }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/decorators/hidden.ts#L0-L0">/swagger/decorators/hidden.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Hidden</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

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

<!-- Members -->

