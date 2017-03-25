
import {Service} from "../decorators/service";
import ParseService from "./parse";

@Service()
export default class ResponseService {
    constructor(private parse: ParseService) {

    }
    /**
     *
     * @param response
     * @param expression
     */
    parseLocals = (response, expression) => this.parse.eval(expression, response["locals"]);
}

