import {BodyParams} from "../../index";
export class TestParamsRequiredFactory {
    middlewares: any;
    called: boolean = false;

    myMethod(@BodyParams("test") test): void {
        this.called = true;
    }
}