# Lifecycle Hooks

Ts.ED 2.x introduce a new Lifecycle Hooks on the service that follows the [Lifecycle of the ServerLoader](docs/server-loader/lifecycle-hooks.md).
This lifecycle hooks that provide visibility into these key life moments and the ability to act when they occur.


A service that uses one of the phases of the lifecycle can add a number of things and can be completely autonomous. 
This is the case with the example of the socket server (See the section [How to integrate Socket.io](tutorials/how-to-integrate-socket-io.md)).

This schemes resume the order of the service's lifecycle along the ServerLoader's lifecycle.

![lifecycle-hooks](_media/hooks-in-sequence.png)


Each interface has a single hook method whose name is the interface name prefixed with `$`. For example, the `OnInjectorReady` 
interface has a hook method named `$onInjectorReady()` that Ts.ED calls when all services are built.

```typescript
@Service()
export class MyService implements OnInjectorReady, BeforeRoutesInit, OnRoutesInit, AfterRoutesInit, OnServerReady {
    private settings = {};
    
    constructor(
        private serverSettings: ServerSettingsService
    ) {
        this.settings = this.serverSettings.get('customServiceOptions');
    }
    
    $OnInjectorReady() {
        console.log('All services is ready');
    }
    
    $beforeRoutesInit() {
        console.log('Controllers and routes isn\'t mounted');
    }
    
    $onRoutesInit(components: IComponentScanned[]) {
       console.log('Controllers and routes are being built');

    }
    
    $afterRoutesInit() {
        console.log('Controllers and routes are built');
    }
    
    $onServerReady() {
        console.log('Server is ready and listen the port');
    }
}
```

Hook | Purpose and Timing
---|---
$onInjectorReady | Respond after Injector have initialized all Services in the registry.
$beforeRoutesInit | Respond before loading the controllers. The middlewares and filters are already built.
$onRoutesInit | Launch the build of the controllers. This hook provide a list of component scanned by componentsScan. 
$afterRoutesInit | Respond after the controllers build. 
$onServerReady | Respond when the server is ready. At this step, HttpServer or/and HttpsServer object is available. The server listen the port.


### Interfaces are optional (technically)

The interfaces are optional for JavaScript and Typescript developers from a purely technical perspective. 
The JavaScript language doesn't have interfaces. Ts.ED can't see TypeScript interfaces at runtime because they disappear from the transpiled JavaScript.

Nonetheless, it's good practice to add interfaces to TypeScript directive classes in order to benefit from strong typing and editor tooling.



