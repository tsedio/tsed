import {Injectable} from "@tsed/di";
import {Health} from "@tsed/terminus";

@Injectable()
class MongoClient {
  @Health("mongo")
  async health() {
    return "ok";
  }
}
