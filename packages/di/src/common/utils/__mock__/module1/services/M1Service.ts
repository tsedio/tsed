import {Injectable} from "../../../../decorators/injectable.js";
import type {SubService} from "../submodule/SubService.js";

@Injectable()
export class M1Service {
  constructor(public subService: SubService) {}
}
