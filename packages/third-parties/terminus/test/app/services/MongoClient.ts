import {Health} from "../../../src/index.js";
import {Injectable} from "@tsed/di";

@Injectable()
class MongoClient {
  @Health("mongo")
  health() {
    return Promise.resolve("ok");
  }
}
