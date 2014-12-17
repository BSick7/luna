module luna.http {
    export interface IHttpResponse {
        status: number;
        statusText: string;
        response: any;
        responseText: string;
        isCancel: boolean;
        isTimeout: boolean;
    }

    export class HttpResponse implements IHttpResponse {
        private $$xhr: XMLHttpRequest;
        isCancel = false;
        isTimeout = false;

        get status (): number {
            return this.$$xhr.status;
        }

        get statusText (): string {
            return this.$$xhr.statusText;
        }

        get response (): any {
            return this.$$xhr.response;
        }

        get responseText (): string {
            return this.$$xhr.responseText;
        }

        constructor (xhr: XMLHttpRequest) {
            this.$$xhr = xhr;
        }

        static normal (xhr: XMLHttpRequest): HttpResponse {
            var response = new HttpResponse(xhr);
            Object.freeze(this);
            return response;
        }

        static timeout (xhr: XMLHttpRequest): HttpResponse {
            var response = new HttpResponse(xhr);
            response.isTimeout = true;
            Object.freeze(this);
            return response;
        }

        static cancel (xhr: XMLHttpRequest): HttpResponse {
            var response = new HttpResponse(xhr);
            response.isCancel = true;
            Object.freeze(this);
            return response;
        }
    }
}