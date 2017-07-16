[Home](https://github.com/Romakita/ts-express-decorators/wiki) > API References

## Decorators
### Class decorators
Signature | Example | Description
--- | --- | ---
[`@ServerSettings(settings: IServerSettings)`](https://github.com/Romakita/ts-express-decorators/wiki/Configure-server-with-decorator) | `@ServerSettings(options) class Server extends ServerLoader` | Configure your Server with decorators.
[`@Controller(route: string, ...ctrlsNamesDependencies?: string[])`](https://github.com/Romakita/ts-express-decorators/wiki/Controllers) | `@Controller('/rest/calendars') class MyController` | Declare a new controller with his Rest path. His methods annotated will be collected to build the routing list. This routing listing will be built with the `express.Router` object.
[`@Service()`](https://github.com/Romakita/ts-express-decorators/wiki/Services) |  `@Service() class Service` | Declare a new Service that can be injected in other `Service` or `Controller`.
[`@Converter(...targetTypes: any[])`](https://github.com/Romakita/ts-express-decorators/wiki/Converters) | `@Converter() class CustomeConverter` | Declare a new serializer/deserializer when a class/type is deserialized from JSON and vice versa.
[`@Middleware()`](https://github.com/Romakita/ts-express-decorators/wiki/Middlewares) | `@MyMiddleware() class Middleware` | Declare a new Middleware that can used with other method decorator or in the ServerLoader as global Middleware. 
[`@MiddlewareError()`](https://github.com/Romakita/ts-express-decorators/wiki/Middlewares) | `@MiddlewareError() class MyMiddlewareError` | Declare a new MiddlewareError that can used with other method decorator or in the ServerLoader as global MiddlewareError. 

### Method decorators
#### Routing

Signature | Example | Description | Express analogue
--- | --- | --- | ---
`@All(route)` | `@All('/calendars') all()` | Intercept all request for a given route. | `router.all('/calendars', all)`
`@Get(route)` | `@Get('/calendars') get()` | Intercept request with GET Http verb for a given route. | `router.get('/calendars', get)`
`@Post(route)` | `@Post('/calendars') post()` | Intercept request with POST Http verb for a given route. | `router.post('/user', post)`
`@Put(route)` | `@Put('/calendars') put()` | Intercept request with PUT Http verb for a given route. | `router.put('/calendars', put)`
`@Delete(route)` | `@Delete('/calendars') delete()` | Intercept request with DELETE Http verb for a given route. | `router.delete('/calendars', delete)`
`@Head(route)` | `@Head('/calendars') head()` | Intercept request with HEAD Http verb for a given route. | `router.head('/calendars', head)`
`@Patch(route)` | `@Patch('/calendars') patch()` | Intercept request with PATCH Http verb for a given route. | `router.patch('/calendars', patch)`

#### Middlewares

Signature | Example | Description | Express analogue
--- | --- | --- | ---
`@Authenticated(options?)` | `@Autenthicated() @Get('/calendars') get()` | Call the `Server.isAuthenticated` method to check if the user is authenticated. | `router.get('/calendars', authenticatedMiddleware, get)`
`@Use(...middlewares: any[])` | `@Use(middleware) method()` |  Set a custom middleware or custom Http method. | `router.use(middleware, method)` 
`@UseBefore(...middlewares: any[])` | `@UseBefore(middleware) method()` |  Set a middleware. This middleware are called before the class method. | `router.use(middleware, method)` 
`@UseAfter(...middlewares: any[])` | `@UseAfter(middleware) method()` |  Set a middleware. This middleware are called after the class method. | `router.use(middleware, method)` 
`@ResponseView(viewPath: string, options: any)` | `@Get('/calendars') @ResponseView('calendars.html') myMethod()` | Render `viewPath` file using the method return data.
`@Render(viewPath: string, options: any)` | `@Get('/calendars') @Render('calendars.html') myMethod()` | Render `viewPath` file using the method return data.

#### Response

Signature | Example | Description | Express analogue
--- | --- | --- | ---
`@ContentType()` | `@Get('/calendars') @ContentType('text/xml') myMethod()` | Sets the Content-Type HTTP header to the MIME type as determined by `mime.lookup()` for the specified type. If type contains the “/” character, then it sets the `Content-Type` to type. | `response.type('text/xml')`
`@Header()` | `@Get('/calendars') @Header('Content-Type', 'plain/text') myMethod()` | Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter. | `response.set('Content-Type', 'text/xml')`
`@Location()` | `@Get('/calendars') @Location('/docs/page.html') myMethod()` | Sets the response Location HTTP header to the specified path parameter. | `response.location('/doc/page.html')` 
`@Redirect()` | `@Get('/calendars') @Redirect('/docs/page.html') myMethod()` | Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an HTTP status code . If not specified, status defaults to “302 “Found”. | `response.redirect('/doc/page.html')` 
`@Status()` | `@Get('/calendars') @Status(201) myMethod()` | Sets the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`. | `response.status(201)`

#### Others

Signature | Example | Description | Express analogue
--- | --- | --- | ---
`@Inject()` | `@Inject() myMethod(service1: Service1)` | Inject services in parameters for the class method.
`@Deprecated(msg)` | `@Deprecated("myOldMethod are deprecated") myOldMethod()` | Log a depreciation message in the console. 

### Attributs/Methods Decorators

Signature | Example | Description | Express analogue
--- | --- | --- | ---
`@JsonProperty(obj: string | IJsonMetadata)` | `@JsonProperty() myAttributs: string;` | Flag an attribut that can be serialized or deserialized. (See [Converters page](https://github.com/Romakita/ts-express-decorators/wiki/converters))

### Parameter Decorators

Signature | Example | Description | Express analogue
--- | --- | --- | ---
`@Request()` | `get(@Request() request: Request) {}` | Inject the `Express.Request` service. | `function(request, response) {}`
`@Response()` | `get(@Response() response: Response) {}` | Inject the `Express.Response` service. | `function(request, response) {}`
`@Next()` | `get(@Next() response: NextFunction) {}` | Inject the `Express.NextFunction` service. | `function(request, response, next) {}`
`@PathParams(expression?: string, useClass?: any)` | `get(@PathParam("id") id: string) {}` |  Get a parameters on `Express.request.params` attribut. | `request.params.id`
`@BodyParams(expression?: string, useClass?: any)` | `get(@BodyParam() calendar: CalendarModel) {}` | Inject a parameters on `Express.request.body` attribut. | `request.body`
`@CookiesParams(expression?: string, useClass?: any)` | `get(@CookiesParams("cook") cook: string) {}` | Get a parameters on `Express.request.cookies` attribut. | `request.cookies.cook`
`@QueryParams(expression?: string, useClass?: any)` | `get(@QueryParams("id") id: string) {}` | Get a parameters on `Express.request.query` attribut. | `request.query.id`
`@Session(expression?: string, useClass?: any)` | `get(@Session() context: Context) {}` | Get a parameters on `Express.request.session` attribut. | `request.session`
`@HeaderParams(key: string)` | `get(@Header("x-token") token: string) {}` | Inject request header parameters. | `request.get('x-token')`
`@Required()` | `get(@QueryParams("id") @Required() id: string) {}` | Set a required flag on a parameter. | 
`@MultipartFile()` | `post(@MultipartFile() file: Multer.File) {}` | Provide the `Multer.File` object. | `request.file` 
`@MultipartFile()` | `post(@MultipartFile() file: Multer.File[]) {}` | Provide a list of `Multer.File` object. | `request.files`

> Note : `useClass` parameters is only required if you want to deserialize a collection type. (See [converters page](https://github.com/Romakita/ts-express-decorators/wiki/converters)).

#### Only for middlewares

Signature | Example | Description | Express analogue
--- | --- | --- | ---
`@Err()` | `useMethod(@Err() err: any) {}` | Inject the `Express.Err` service. (Decorator for middleware).| `function(err, request, response, next) {}`
`@ResponseData()` | `useMethod(@ResponseData() data: any)` | Provide the data returned by the previous middlewares.
`@EndpointInfo()` | `useMethod(@EndpointInfo() endpoint: Endpoint)` | Provide the endpoint settings.

## Services

Some services are provided by `ts-express-decorators`. Theses services are follows:

Service Name | Description
--- | ---
[ControllerService](https://github.com/Romakita/ts-express-decorators/wiki/Controllers) | This service contain all controllers defined with `@Controller`. 
[ConverterService](https://github.com/Romakita/ts-express-decorators/wiki/Converters) | This service contain all default and custom converters defined with `@Converter()`.
[ExpressApplication](https://github.com/Romakita/ts-express-decorators/wiki/ExpressApplication) | This service contain the instance of `Express.Application`.
[InjectorService](https://github.com/Romakita/ts-express-decorators/wiki/InjectorService) | This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.
[MiddlewareService](https://github.com/Romakita/ts-express-decorators/wiki/Middlewares) | This service contain all default and custom converters defined with `@Middleware()` or `@MiddlewareError()`.
ParseService | Parse an expression and get a data from an Object.
RequestService | Provide methods to get header, bodyParams, queryParams, pathParams or Session data from an expression.
[RouterController](https://github.com/Romakita/ts-express-decorators/wiki/RouterController) | Provide the Express.Router instance of the class declared as `@Controller`.
[ServerSettings](https://github.com/Romakita/ts-express-decorators/wiki/ServerSettings) | Provide the server configuration.
