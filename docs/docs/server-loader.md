# ServerLoader

ServerLoader provider all method to instantiate an ExpressServer. ServerLoader can't be instantiated directly. You must create your own Server class inherited the ServerLoader class.

It let you manage lifecycle server like middlewares configuration, authentification strategy or global error interception (see [Lifecycle](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks)).

### Sections

* [Lifecycle hooks](docs/server-loader/lifecycle-hooks.md)
* [Versioning Rest API](docs/server-loader/versioning.md)
* [API](docs/server-loader/api.md)
* [Authentification](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks#serverloaderonauthrequest-response-next-void)
* [Global errors handlers](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader---Lifecycle-Hooks#serverloaderonerrorerror-request-response-next-void)


