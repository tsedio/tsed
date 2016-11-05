
import {Service} from '../decorators/service';
import ParseService from './parse';

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
    parseBody = (request, expression) => this.parse.eval(expression, request['body']);
    /**
     *
     * @param request
     * @param expression
     */
    parseCookies = (request, expression) => this.parse.eval(expression, request['cookies']);
    /**
     *
     * @param request
     * @param expression
     */
    parseParams = (request, expression) => this.parse.eval(expression, request['params']);
    /**
     *
     * @param request
     * @param expression
     */
    parseQuery = (request, expression) => this.parse.eval(expression, request['query']);
}

