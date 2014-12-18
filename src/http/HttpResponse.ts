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
        private $$raw: IRawRequest;
        isCancel = false;
        isTimeout = false;

        get status (): number {
            return this.$$raw.status;
        }

        get statusText (): string {
            return this.$$raw.statusText;
        }

        get response (): any {
            return this.$$raw.response;
        }

        get responseText (): string {
            return this.$$raw.responseText;
        }

        get responseJson (): any {
            if (this.$$raw.responseType === "json")
                return this.$$raw.response;
            return JSON.parse(this.$$raw.responseText);
        }

        constructor (xhr: IRawRequest) {
            this.$$raw = xhr;
        }

        static normal (xhr: IRawRequest): HttpResponse {
            var response = new HttpResponse(xhr);
            Object.freeze(this);
            return response;
        }

        static timeout (xhr: IRawRequest): HttpResponse {
            var response = new HttpResponse(xhr);
            response.isTimeout = true;
            Object.freeze(this);
            return response;
        }

        static cancel (xhr: IRawRequest): HttpResponse {
            var response = new HttpResponse(xhr);
            response.isCancel = true;
            Object.freeze(this);
            return response;
        }
    }
}