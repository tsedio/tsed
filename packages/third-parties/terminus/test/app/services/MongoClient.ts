import {Injectable} from "@tsed/di";

import {Health} from "../../..";

@Injectable()
class MongoClient {
  @Health("mongo")
  health() {
    return Promise.resolve("ok");
  }
}
