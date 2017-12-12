<header class="symbol-info-header">    <h1 id="expressapplication">ExpressApplication</h1>    <label class="symbol-info-type-label service">Service</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { ExpressApplication }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v2.16.3/src/core/services/ExpressApplication.ts#L0-L0">                core/services/ExpressApplication.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">type ExpressApplication = Express.Application<span class="token punctuation">;</span>
<span class="token keyword">const</span> ExpressApplication<span class="token punctuation">:</span> symbol<span class="token punctuation">;</span></code></pre>

### Description

`ExpressApplication` is an alias type to the [Express.Application](http://expressjs.com/fr/4x/api.html#app) interface. It use the new feature `Injector.factory()` and let you to inject [Express.Application](http://expressjs.com/fr/4x/api.html#app) created by [ServerLoader](docs/server-loader/lifecycle-hooks.md).

```typescript
import {ExpressApplication, Service, Inject} from "ts-express-decorators";

@Service()
export default class OtherService {
   constructor(@ExpressApplication expressApplication: ExpressApplication){
          console.log(myFooFactory.getFoo()); /// "test"
    }
}
```

> Note: TypeScript transform and store `ExpressApplication` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.
