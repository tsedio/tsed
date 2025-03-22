import {Injectable} from "../../../../../index.js";
import {SubService} from "../submodule/SubService.js";

@Injectable()
export class M1Service {
  constructor(public subService: SubService) {}
}
