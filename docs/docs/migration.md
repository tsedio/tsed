# Migration

See release note on Github: https://github.com/Romakita/ts-express-decorators/releases

## From v1.x to v2.x

- ServerLoader.isAuthenticated hooks is removed. Use ServerLoader.$onAuth hook instead of.
- Interface IPromise is removed. Use Promise instead of.
- Interface ICrud is removed.
- ServerLoader.AcceptMime() is removed. Use GlobalAcceptMimesMiddleware instead of (see documentation https://romakita.github.io/ts-express-decorators#/docs/middlewares/global-middleware). 
- Update [ts-log-debug](https://romakita.github.io/ts-log-debug) to the new major version.

## From v1.3 or under to v1.4

The `@types/express` modules dependency has move to devDependencies. So you can have a compilation error with TypeScript.
To resolve it, just run `npm install --save @types/express`.

If we used the InjectorService. Make you sure we have this in your code:

* `InjectorService.invoke(target)` has changed to `InjectorService.invoke<T>(target): T`.
* `InjectorService.get(target)` has changed to `InjectorService.get<T>(target): T`.
