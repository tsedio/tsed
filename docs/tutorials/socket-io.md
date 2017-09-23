# How to integrate Socket.io
>  Socket.io enable real-time bidirectional event-based communication. It works on every platform, browser or device, focusing equally on reliability and speed. 

## Installation 

Run this command:
```typescript
npm install --save socket.io
```
If you want type checking for Socket.io, run this command:
```typescript
npm install --save-dev @types/socket.io
```

## Example 

Use the `$onReady` hook to create your Socket server:
```typescript
import {ServerLoader, ServerSettings, Inject} from "ts-express-decorators";
import Path = require("path");

@ServerSettings({
    rootDir: Path.resolve(__dirname),
    componentsScan: [
        "${rootDir}/services/**/*.js"
    ]
})
class Server extends ServerLoader {}
```

Wrap socket.io into a service:

```typescript
import * as SocketIO from "socket.io";
import {HttpServer, Inject, OnServerReady, Service} from "ts-express-decorators";

@Service()
export class SocketService implements OnServerReady {

    private _io: SocketIO.Server;
    private stacks = [];

    constructor(@Inject(HttpServer) private httpServer: HttpServer) {

    }

    $onServerReady() {
        this.createServer();
    }

    /**
     * Store all callbacks that will be adding to socket.io instance when
     *  it'll be created. See SocketService.createServer().
     */
    public onConnection(callback: Function): SocketService {
        this.stacks.push(callback);
        return this;
    }

    public emit = (eventName: string, ...args: any[]) => this._io.emit(eventName, ...args);

    createServer() {
        this._io = SocketIO(this.httpServer.get());

        // Map all callbacks to this connection events.
        this.stacks.forEach(cb => this._io.on("connection", cb));
    }

    get io(): SocketIO.Server {
        return this._io;
    }
}
```

Finally, inject your service to another service or controller : 

```typescript
import {Controller} from "ts-express-decorators";
import SocketService from "../services/SocketService";

@Controller('/')
export class MySocketCtrl {
    
   constructor(private socketService: SocketService) {
       socketService.onConnection(this.onConnection);
   }
   
   private onConnection = (socket) => {
      // write your code :)
   }
}
```
