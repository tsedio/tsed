
<header class="symbol-info-header"><h1 id="args">Args</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Args }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/socketio"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//socketio/decorators/args.ts#L0-L0">/socketio/decorators/args.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Args</span><span class="token punctuation">(</span>mapIndex?<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Inject the list of arguments in the decorated parameter.

`@Args` accept an index parameter to pick up directly the item in the arguments list.

### Example

```typescript
@SocketService("/nsp")
export class MyWS {

  @Input("event")
  myMethod(@Args() arguments: any[]) {

  }

  @Input("event2")
  myMethod2(@Args(0) data: any) {

  }
}
```

<!-- Members -->

