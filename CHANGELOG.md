# CHANGELOG

See new changelog [here](https://github.com/Romakita/ts-express-decorators/releases).

## v1.4.0

* Add `@Inject()` decorator [#42](https://github.com/Romakita/ts-express-decorators/issues/42),
* Add `@Middleware()` decorator [#40](https://github.com/Romakita/ts-express-decorators/issues/40),
* Add `@ContentType()` decorator [#34](https://github.com/Romakita/ts-express-decorators/issues/34),
* Add `@Redirect()` decorator [#33](https://github.com/Romakita/ts-express-decorators/issues/33),
* Add `@Location()` decorator [#32](https://github.com/Romakita/ts-express-decorators/issues/32),
* Add `@UseBefore()` decorator [#19](https://github.com/Romakita/ts-express-decorators/issues/19),
* Add `@UseAfter()` decorator [#19](https://github.com/Romakita/ts-express-decorators/issues/19),
* Add  alias `@HeaderParams()` decorator [#30](https://github.com/Romakita/ts-express-decorators/issues/30),
* Extends `@Header()` decorator. Now @Header can be used on method [#30](https://github.com/Romakita/ts-express-decorators/issues/30),
* Add `@MultipartFile()` decorator [#31](https://github.com/Romakita/ts-express-decorators/issues/31),
* Refactoring `InjectorService`. You can add a no class based service (factory)  [#36](https://github.com/Romakita/ts-express-decorators/issues/36),
* `InjectorService` can be use in `ServerLoader.$onMountingMiddleware()` [#39](https://github.com/Romakita/ts-express-decorators/issues/39).
* Add `@AcceptMime()` decorator,
* Add `@Status()` decorator,
* Add `@Deprecated()` decorator,
* Add `@ServerSettings()` decorator to configure ServerLoader,
* Add some services : ControllerService, ExpressApplication, MiddlewareService and ServerSettingsService
* Add `boostrap()` function to test your server application with Mocha and SuperTest. 
* Improve testing module.
* Add Symbol serialization/deserialization support.
* Fix Array deserialization when input data isn't an array.
* Support of Typescript 2.2.x.

### Method deprecated

* `ServerLoader.onError()` is deprecated. Use your own middleware instead of.
* `ServerLoader.getExpressApp` is deprecated. Use ServerLoader.expressApp instead of.
* `ServerLoader.AcceptMime()` is deprecated. Use your own middleware instead of.

### Breaking Change 

You can encounter typescript compilation issues:

* `InjectorService.invoke(target)` has changed to `InjectorService.invoke<T>(target): T`.
* `InjectorService.get(target)` has changed to `InjectorService.get<T>(target): T`.
* `@types/express` isn't installed as dependencies now. Just make `npm install --save @types/express`.


## v1.3.0

* Add `@Session()` decorator [#11](https://github.com/Romakita/ts-express-decorators/issues/11),
* Add `@ResponseView()` decorator [#9](https://github.com/Romakita/ts-express-decorators/issues/9), [#16](https://github.com/Romakita/ts-express-decorators/issues/16), [#22](https://github.com/Romakita/ts-express-decorators/issues/22), 
* Add model deserialization and add decorator `@JsonProperty` [#3](https://github.com/Romakita/ts-express-decorators/issues/3),
* Add two proxy methods : `ServerLoader.set()` and `ServerLoader.engine()` [#18](https://github.com/Romakita/ts-express-decorators/issues/18),
* Add `yarn` support [#21](https://github.com/Romakita/ts-express-decorators/issues/21),
* Pass bind interface to http server [#27](https://github.com/Romakita/ts-express-decorators/issues/27),
* Prevent sending data if header is already sent [#28](https://github.com/Romakita/ts-express-decorators/issues/28),
* Add ServerLoader.mount(). This method can mount controller to one or more endpoints [#13](https://github.com/Romakita/ts-express-decorators/issues/13).

## v1.2.0

* Remove Bluebird and use native Promise. Breaking change are possible if you use v1.1.0 of ts-express-decorators. Just, replace Bluebird reference in your `Server.ts` or install Bluebird and @types/bluebird dependencies.
* Improve `package.json` configuration. Now, IDE like webstorm can auto discovered the exposed decorators.
* Implement [Lifecycle hooks](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader#lifecycle-hooks).
* Change testing module. See documentation (https://github.com/Romakita/ts-express-decorators/wiki/Testing).
