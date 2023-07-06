import {Controller} from "../../../../decorators/controller";
import {M1Service} from "../services/M1Service";

@Controller("/m1")
export class M1Ctrl1 {
  constructor(public service: M1Service) {}
}
