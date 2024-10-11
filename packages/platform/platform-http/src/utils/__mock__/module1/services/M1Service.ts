import {Injectable} from "../../../../../../../di/src/index";
import {SubService} from "../submodule/SubService.js";

@Injectable()
export class M1Service {
  constructor(public subService: SubService) {}
}
