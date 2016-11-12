import {INJECT_PARAMS} from "../constants/metadata-keys";
import Metadata from "./metadata";

export default class InjectParams {
    /**
     *
     */
    public required: boolean;
    /**
     *
     */
    public expression: string;
    /**
     *
     */
    private _service: symbol;
    /**
     *
     */
    private _name: string;

    /**
     *
     * @returns {symbol}
     */
    get service(): symbol {

        return this._service;
    }

    /**
     *
     * @param value
     */
    set service(value: symbol) {

        this._service = value;
        this._name = this._service.toString().replace("Symbol(", "").replace(")", "");
    }

    /**
     *
     * @returns {string}
     */
    get name(): string {
        return this._name;
    }

    /**
     *
     * @param target
     * @param targetKey
     * @param index
     * @returns {any}
     */
    static get(target: any, targetKey: string | symbol, index: number): InjectParams {

        const params = Metadata.has(INJECT_PARAMS, target, targetKey)
            ? Metadata.get(INJECT_PARAMS, target, targetKey)
            : [];

        params[index] = params[index] || new InjectParams();

        return params[index];

    }

    /**
     *
     * @param target
     * @param targetKey
     * @param index
     * @param injectParams
     */
    static set(target: any, targetKey: string | symbol, index: number, injectParams: InjectParams): void {

        const params = Metadata.has(INJECT_PARAMS, target, targetKey)
            ? Metadata.get(INJECT_PARAMS, target, targetKey)
            : [];

        params[index] = injectParams;

        Metadata.set(INJECT_PARAMS, params, target, targetKey);
    }
}