import {Inject, Injectable} from "@tsed/common";
import {CONNECTION} from "./connection";

@Injectable()
export class MyService {
  constructor(@Inject(CONNECTION) connection: any) {

  }
}
