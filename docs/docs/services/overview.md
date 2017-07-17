# Services

The decorator `@Service()` declare a new service can be injected in other service or controller on there `constructor()`.
All services annotated with `@Service()` are constructed one time.

## Installation

You must adding the `services` folder on `componentsScan` attribute in your server settings as follow :
 
```typescript
import {ServerLoader} from "ts-express-decorators";
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
