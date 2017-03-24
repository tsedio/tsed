
import {Service} from "../decorators/service";
import ParseService from "./parse";

@Service()
export default class RequestService {
    constructor(private parse: ParseService) {

    }

    /**
     *
     * @param request
     * @param expression
     */
    getHeader = (request, expression) => request.get(expression);
    /**
     *
     * @param request
     * @param expression
     */
    parseBody = (request, expression) => this.parse.eval(expression, request["body"]);
    /**
     *
     * @param request
     * @param expression
     */
    parseCookies = (request, expression) => this.parse.eval(expression, request["cookies"]);
    /**
     *
     * @param request
     * @param expression
     */
    parseParams = (request, expression) => this.parse.eval(expression, request["params"]);
    /**
     *
     * @param request
     * @param expression
     */
    parseQuery = (request, expression) => this.parse.eval(expression, request["query"]);
    /**
     *
     * @param request
     * @param expression
     */
    parseSession = (request, expression) => this.parse.eval(expression, request["session"]);
    /**
     *
     * @param request
     * @param expression
     */
    parseLocals = (request, expression) => this.parse.eval(expression, request["locals"]);
    /**
     *
     * @param request
     */
    multipartFile = (request) => request["files"][0];
    /**
     *
     * @param request
     */
    multipartFiles = (request) => request["files"];
    /**
     *
     * @param request
     */
    responseData = (request): any => request.getStoredData();
    /**
     *
     * @param request
     */
    endpointInfo = (request): any => request.getEndpoint();
}

