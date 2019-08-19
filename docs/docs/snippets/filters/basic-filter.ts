import {Filter, IFilter, ParseService} from "@tsed/common";
import * as Express from "express";

@Filter()
export class CustomBodyParamFilter implements IFilter {

  constructor(private parseService: ParseService) {
  }

  transform(expression: string, request: Express.Request, response: Express.Response) {
    return this.parseService.eval(expression, request["body"]);
  }
}
