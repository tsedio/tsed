# Services

The decorator `@Service()` declare a new service can be injected in other service or controller on there `constructor()`.
All services annotated with `@Service()` are constructed one time.

## Installation

You must adding the `services` folder on `componentsScan` attribute in your server settings as follow :
 
```typescript
import {ServerLoader} from "@tsed/common";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`
   ],
   customServiceOptions: {}
})
export class Server extends ServerLoader {
   
}       
```

## Decorators

<ul class="api-list"><li class="api-item" data-symbol="common/di;Inject;decorator;@;false;false;false;false"><a href="#/api/common/di/inject"class="symbol-container symbol-type-decorator symbol-name-commondi-Inject"title="Inject"><span class="symbol decorator"></span>Inject</a></li><li class="api-item" data-symbol="common/di;OverrideProvider;decorator;@;false;false;false;false"><a href="#/api/common/di/overrideprovider"class="symbol-container symbol-type-decorator symbol-name-commondi-OverrideProvider"title="OverrideProvider"><span class="symbol decorator"></span>OverrideProvider</a></li><li class="api-item" data-symbol="common/di;OverrideService;decorator;@;false;false;false;false"><a href="#/api/common/di/overrideservice"class="symbol-container symbol-type-decorator symbol-name-commondi-OverrideService"title="OverrideService"><span class="symbol decorator"></span>OverrideService</a></li><li class="api-item" data-symbol="common/di;Service;decorator;@;false;false;false;false"><a href="#/api/common/di/service"class="symbol-container symbol-type-decorator symbol-name-commondi-Service"title="Service"><span class="symbol decorator"></span>Service</a></li></ul>

## Declaring a service

Create a new file in your services folder. Create a new Class definition and add the `@Service()` annotation on your class.

```typescript
@Service()
export class MyService implements OnInit, BeforeRoutesInit, OnRoutesInit, AfterRoutesInit, OnServerReady {
    private settings = {};
    
    constructor(
        private serverSettings: ServerSettingsService
    ) {
        this.settings = this.serverSettings.get('customServiceOptions');
    }
    
    public getSettings() {
        return this.settings;
    }
}
```

Finally, inject the service to another service:
```typescript
import {MyService} from "./MyService";

@Service()
export class FooService {
    constructor(private myService: myService) {
    
    }
}
```
Or to another controller: 

```typescript
import {MyService} from "./MyService";

@Controller('/rest') 
class MyController {
    constructor(private myService: MyService){
    
    }
}  
```

## Override a Service

The decorator [@OverrideService](api/common/di/overrideservice.md) gives you the ability to 
override some internal Ts.ED service like the [ParseService](api/common/filters/parseservice.md).

Example usage:
```typescript
import {OverrideService, ParseService} from "@tsed/common"

@OverrideService(ParseService)
class CustomParseService extends ParseService {
    
}
```

<div class="guide-links">
<a href="#/docs/controllers">Controllers</a>
<a href="#/docs/services/lifecycle-hooks">Lifecycle hooks</a>
</div>