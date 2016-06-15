export interface IInvokedFNResult {
    result: Promise<any> | any | void;
    impliciteNext: boolean;
}