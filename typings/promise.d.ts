interface IPromise<T> {
    then<TResult>(onFulfilled: (t: T) => TResult): IPromise<TResult>;
    then<TResult>(onFulfilled: (t: T) => TResult, onRejected: (reason: any) => void): IPromise<TResult>;
    then<TResult>(onFulfilled: (t: T) => TResult, onRejected: (reason: any) => TResult): IPromise<TResult>;
    catch<TResult>(onRejected: (reason: any) => void): IPromise<T>;
    catch<TResult>(onRejected: (reason: any) => TResult): IPromise<T>;
}
interface IPromiseExecutor<T> {
    (resolve: (value: T) => any, reject: (reason: any) => any);
}
declare class Promise<T> implements IPromise<T> {
    constructor (executor: IPromiseExecutor<T>);
    then<TResult>(onFulfilled: (t: T) => TResult): IPromise<TResult>;
    then<TResult>(onFulfilled: (t: T) => TResult, onRejected: (reason: any) => void): IPromise<TResult>;
    then<TResult>(onFulfilled: (t: T) => TResult, onRejected: (reason: any) => TResult): IPromise<TResult>;
    catch<TResult>(onRejected: (reason: any) => void): IPromise<T>;
    catch<TResult>(onRejected: (reason: any) => TResult): IPromise<T>;

    static all (iterable: any[]): IPromise<any>;
    static race (iterable: any[]): IPromise<any>;
    static reject (reason: any): IPromise<any>;
    static reject<TReason>(reason: any): IPromise<TReason>;
    static resolve<TValue>(value: TValue): IPromise<TValue>;
}