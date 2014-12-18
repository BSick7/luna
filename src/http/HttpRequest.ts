module luna.http {
    export interface IHttpRequest extends Thenable<HttpResponse> {
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

    export class HttpRequest implements IHttpRequest {
        private $$config: IHttpConfig;
        private $$xhr: IRawRequest;
        private $$resolve: (result: any) => void;
        private $$reject: (reason: any) => void;
        private $$promise: Promise<HttpResponse>;

        constructor () {
            this.$$promise = new Promise((resolve, reject) => {
                this.$$resolve = resolve;
                this.$$reject = reject;
            });
        }

        createRawRequest (): IRawRequest {
            return new XMLHttpRequest();
        }

        config (config: IHttpConfig): HttpRequest {
            var curconfig = this.$$config = this.$$config || {method: "GET", url: ""};
            for (var i = 0, keys = Object.keys(config); i < keys.length; i++) {
                var key = keys[i];
                curconfig[key] = config[key];
            }
            return this;
        }

        header (name: string, value: string): HttpRequest {
            this.$$xhr = this.$$xhr || this.createRawRequest();
            this.$$xhr.setRequestHeader(name, value);
            return this;
        }

        send (): HttpRequest;
        send (data: ArrayBuffer): IHttpRequest;
        send (data: ArrayBufferView): HttpRequest;
        send (data: Blob): HttpRequest;
        send (data: Document): HttpRequest;
        send (data: string): HttpRequest;
        send (data: FormData): HttpRequest;
        send (data?: any): HttpRequest {
            var config = this.$$config;
            var xhr = this.$$xhr = this.$$xhr || this.createRawRequest();
            xhr.timeout = config.timeout || 0;
            xhr.responseType = config.type || "";
            xhr.open(config.method, config.url, true, config.user, config.password);
            xhr.send(data);
            xhr.ontimeout = (ev) => this.$$reject(HttpResponse.timeout(xhr));
            xhr.onerror = (ev) => this.$$reject(HttpResponse.normal(xhr));
            xhr.onload = (ev) => {
                var response = HttpResponse.normal(xhr);
                this.$$isError(response)
                    ? this.$$reject(response)
                    : this.$$resolve(response);
            };
            return this;
        }

        cancel (): boolean {
            if (!this.$$xhr)
                return false;
            this.$$xhr.abort();
            this.$$reject(HttpResponse.cancel(this.$$xhr));
            return true;
        }

        private $$isError (status: HttpResponse): boolean {
            return status.code >= 400;
        }

        then<U>(onFulfilled?: (value: HttpResponse) => Thenable<U>, onRejected?: (error: any) => Thenable<U>): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => Thenable<U>, onRejected?: (error: any) => U): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => U, onRejected?: (error: any) => Thenable<U>): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => U, onRejected?: (error: any) => U): Thenable<U>;
        then<U>(onFulfilled?: (value: HttpResponse) => U, onRejected?: (error: any) => void): Thenable<U> {
            return this.$$promise.then(onFulfilled, onRejected);
        }
    }
}