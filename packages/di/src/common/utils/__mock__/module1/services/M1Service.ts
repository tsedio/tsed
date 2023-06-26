import {Injectable} from "../../../../decorators/injectable";
import {SubService} from "../submodule/SubService";

@Injectable()
export class M1Service {
  constructor(public subService: SubService) {}
}
