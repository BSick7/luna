declare module luna {
    var version: string;
}
declare module luna.http {
    interface IHttpRequest {
        url(url: string): IHttpRequest;
        config(config: IHttpConfig): IHttpRequest;
        header(name: string, value: string): IHttpRequest;
        send(): IHttpRequest;
        send(data: ArrayBuffer): IHttpRequest;
        send(data: ArrayBufferView): IHttpRequest;
        send(data: Blob): IHttpRequest;
        send(data: Document): IHttpRequest;
        send(data: string): IHttpRequest;
        send(data: FormData): IHttpRequest;
        cancel(): boolean;
    }
    interface IHttpConfig {
        method: string;
        url: string;
        user?: string;
        password?: string;
        timeout?: number;
    }
    class HttpRequest implements Thenable<HttpResponse>, IHttpRequest {
        private $$config;
        private $$xhr;
        private $$resolve;
        private $$reject;
        private $$promise;
        constructor();
        url(url: string): HttpRequest;
        config(config: IHttpConfig): HttpRequest;
        header(name: string, value: string): HttpRequest;
        send(): HttpRequest;
        send(data: ArrayBuffer): IHttpRequest;
        send(data: ArrayBufferView): HttpRequest;
        send(data: Blob): HttpRequest;
        send(data: Document): HttpRequest;
        send(data: string): HttpRequest;
        send(data: FormData): HttpRequest;
        cancel(): boolean;
        private $$isError(response);
        then<U>(onFulfilled?: (value: HttpResponse) => Thenable<U>, onRejected?: (error: any) => Thenable<U>): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => Thenable<U>, onRejected?: (error: any) => U): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => U, onRejected?: (error: any) => Thenable<U>): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => U, onRejected?: (error: any) => U): Thenable<U>;
    }
}
declare module luna.http {
    interface IHttpResponse {
        status: number;
        statusText: string;
        response: any;
        responseText: string;
        isCancel: boolean;
        isTimeout: boolean;
    }
    class HttpResponse implements IHttpResponse {
        private $$xhr;
        isCancel: boolean;
        isTimeout: boolean;
        status: number;
        statusText: string;
        response: any;
        responseText: string;
        constructor(xhr: XMLHttpRequest);
        static normal(xhr: XMLHttpRequest): HttpResponse;
        static timeout(xhr: XMLHttpRequest): HttpResponse;
        static cancel(xhr: XMLHttpRequest): HttpResponse;
    }
}
