module luna.http.mock {
    export class MockRawRequest implements IRawRequest {
        status: number;
        statusText: string;
        response: any;
        responseText: string;
        responseType: string = "";
        timeout: number;

        onload: (ev: Event) => any;
        ontimeout: (ev: Event) => any;
        onerror: (ev: ErrorEvent) => any;

        sent = {
            method: "",
            url: "",
            async: false,
            user: "",
            password: "",
            data: undefined,
            headers: {}
        };

        setRequestHeader (header: string, value: string) {
            this.sent.headers[header] = value;
        }

        abort () {

        }

        open (method: string, url: string, async?: boolean, user?: string, password?: string): void {
            this.sent.method = method;
            this.sent.url = url;
            this.sent.async = async;
            this.sent.user = user;
            this.sent.password = password;
        }

        send (data?: any): void {
            this.sent.data = data;
            this.$$doSend();
        }

        private $$doSend () {
        }

        static makeTimeout (): MockRawRequest {
            var req = new MockRawRequest();
            req.$$doSend = () => {
                setTimeout(() => {
                    req.ontimeout(null);
                }, 1);
            };
            return req;
        }

        static makeSuccess (status: number, statusText: string, response: any, responseText: string): MockRawRequest {
            var req = new MockRawRequest();
            req.$$doSend = () => {
                setTimeout(() => {
                    req.status = status;
                    req.statusText = statusText;
                    req.response = response;
                    req.responseText = responseText;
                    req.onload(null);
                }, 1);
            };
            return req;
        }

        static makeError (status: number, statusText: string): MockRawRequest {
            var req = new MockRawRequest();
            req.$$doSend = () => {
                setTimeout(() => {
                    req.status = status;
                    req.statusText = statusText;
                    req.onerror(null);
                }, 1);
            };
            return req;
        }
    }
}