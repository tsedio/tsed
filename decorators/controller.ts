import * as Controllers from "./../lib/controllers";

export function Controller(endpointUrl: string, ...ctlrDepedencies: string[]): Function {

    return (targetClass: Function): void => {

        Controllers.setUrl(targetClass, endpointUrl);
        Controllers.setDepedencies(targetClass, ctlrDepedencies);

    };
}