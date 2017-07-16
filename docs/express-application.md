[Home](https://github.com/Romakita/ts-express-decorators/wiki) > [API References](https://github.com/Romakita/ts-express-decorators/wiki/API-references) > ExpressApplication

> This factory is available since v1.4.x

`ExpressApplication` is an alias type to the [Express.Application](http://expressjs.com/fr/4x/api.html#app) interface. It use the new feature `Injector.factory()` and let you to inject [Express.Application](http://expressjs.com/fr/4x/api.html#app) created by [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader).

```typescript
import {ExpressApplication, Service, Inject} from "ts-express-decorators";

@Service()
export default class OtherService {
     constructor(@Inject(ExpressApplication) expressApplication: ExpressApplication){
           console.log(myFooFactory.getFoo()); /// "test"
     }
}
```
> Note: TypeScript transform and store `ExpressApplication` as `Function` type in the metadata. So to inject a factory, you must use the `@Inject(type)` decorator.
