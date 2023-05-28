import {Injectable} from "@tsed/di";
import {Health} from "@tsed/terminus";

@Injectable()
class MongoClient {
  @Health("mongo")
  health() {
    return Promise.resolve("ok");
  }
}
