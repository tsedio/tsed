export interface IPromise<T> extends Promise<T> {
    // then<U>(onFulFill: (result: T) => void, onReject?: (err: any) => void): IPromise<T>;
}