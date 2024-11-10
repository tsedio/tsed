import {Injectable} from "@tsed/di";
import {PlatformCache} from "@tsed/platform-cache";

@Injectable({provide: PlatformCache})
export class CustomCache extends PlatformCache {
  /// do something
}

// server.ts
import "./services/CustomCache.js";

@Configuration({})
export class Server {

}
