# ServerLoader

> This documentation is available only for `TsExpressDecorators` v1.2.x on higher.

ServerLoader provider all method to instantiate an ExpressServer. ServerLoader can't be instantiated directly. You must create your own Server class inherited the ServerLoader class.

It let you manage lifecycle server like middlewares configuration, authentification strategy or global error interception (see [Lifecycle](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks)).

## Sections

* [API](server-loader/api.md)
* [Versioning Rest API](server-loader/versioning.md)
* [Lifecycle hooks](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks)
* [Authentification](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks#serverloaderonauthrequest-response-next-void)
* [Global errors handlers](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks#serverloaderonerrorerror-request-response-next-void)


