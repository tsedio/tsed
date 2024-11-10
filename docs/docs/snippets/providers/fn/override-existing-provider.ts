import {injectable} from "@tsed/di";
import {PlatformCache} from "@tsed/platform-cache";

class CustomCache extends PlatformCache {
  /// do something
}

injectable(PlatformCache).class(CustomCache);

// server.ts
import "./services/CustomCache.js";

export class Server {

}

configuration(Server, {})
