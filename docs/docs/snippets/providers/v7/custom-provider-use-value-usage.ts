import {Inject, Injectable} from "@tsed/di";
import {CONNECTION} from "./connection";

@Injectable()
export class MyService {
  constructor(@Inject(CONNECTION) connection: any) {}
}
