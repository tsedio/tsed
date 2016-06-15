export interface IPromise<T> {
    then<U>(onFulFill: (result: T) => void, onReject?: (err: any) => void): IPromise<T>;
}