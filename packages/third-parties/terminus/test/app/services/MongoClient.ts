import {Injectable} from "@tsed/di";

import {Health} from "../../../src/index.js";

@Injectable()
class MongoClient {
  @Health("mongo")
  health() {
    return Promise.resolve("ok");
  }
}
