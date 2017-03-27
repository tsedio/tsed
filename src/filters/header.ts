import {IFilter} from "../interfaces";
import ParseService from "../services/parse";
import {Filter} from "../decorators/class/filter";

@Filter()
export class HeaderFilter implements IFilter {

    constructor(private parseService: ParseService) {}

    transform(expression: string, request: any, response: any) {
        return request.get(expression);
    }
}