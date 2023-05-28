import {Injectable} from "@tsed/di";
import {Health} from "@tsed/terminus";

@Injectable()
class RedisClient {
  @Health("redis")
  health() {
    return Promise.resolve("ok");
  }

  $beforeShutdown() {
    console.log("called before shutdown");
  }

  $onSignal() {
    console.log("called on signal");
  }

  $onShutdown() {
    console.log("called on shutdown");
  }

  $onSendFailureDuringShutdown() {
    console.log("on send failure during shutdown");
  }
}
