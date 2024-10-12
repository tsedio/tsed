import {Controller} from "../../../../../../../di/src/index.js";
import {M1Service} from "../services/M1Service.js";

@Controller("/m1")
export class M1Ctrl1 {
  constructor(public service: M1Service) {}
}
