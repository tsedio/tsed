import {IFilter} from "../interfaces";
import {Filter} from "../decorators/class/filter";

@Filter()
export class MultipartFileFilter implements IFilter {
    transform(expression: string, request, response) {
        return request["files"][0];
    }
}

@Filter()
export class MultipartFilesFilter implements IFilter {
    transform(expression: string, request, response) {
        return request["files"];
    }
}