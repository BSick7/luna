declare module luna {
    var version: string;
}
declare module luna.http {
    interface IHttpRequest extends Thenable<HttpResponse> {
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
    class HttpRequest implements IHttpRequest {
        private $$config;
        private $$xhr;
        private $$resolve;
        private $$reject;
        private $$promise;
        constructor();
        createRawRequest(): IRawRequest;
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
    class HttpResource<T> {
        private $$templateParts;
        private $$idField;
        constructor(templateUrl: string, idField?: string);
        get(id: any): Promise<T>;
        query(query: any): Promise<T[]>;
        post(t: T): Promise<T>;
        put(id: any, t: T): Promise<T>;
        remove(id: any): Promise<any>;
        createUrl(id?: any): string;
        createRequest(config: IHttpConfig): IHttpRequest;
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
        private $$raw;
        isCancel: boolean;
        isTimeout: boolean;
        status: number;
        statusText: string;
        response: any;
        responseText: string;
        responseJson: any;
        constructor(xhr: IRawRequest);
        static normal(xhr: IRawRequest): HttpResponse;
        static timeout(xhr: IRawRequest): HttpResponse;
        static cancel(xhr: IRawRequest): HttpResponse;
    }
}
declare module luna.http {
    interface IHttpConfig {
        method: string;
        url: string;
        user?: string;
        password?: string;
        timeout?: number;
        type?: string;
    }
}
declare module luna.http {
    interface IRawRequest {
        status: number;
        statusText: string;
        response: any;
        responseText: string;
        responseType: string;
        timeout: number;
        onload: (ev: Event) => any;
        ontimeout: (ev: Event) => any;
        onerror: (ev: ErrorEvent) => any;
        setRequestHeader(header: string, value: string): any;
        abort(): any;
        open(method: string, url: string, async?: boolean, user?: string, password?: string): void;
        send(data?: any): void;
    }
}
