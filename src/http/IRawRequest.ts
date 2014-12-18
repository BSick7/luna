module luna.http {
    export interface IRawRequest {
        status: number;
        statusText: string;
        response: any;
        responseText: string;
        responseType: string;
        timeout: number;

        onload: (ev: Event) => any;
        ontimeout: (ev: Event) => any;
        onerror: (ev: ErrorEvent) => any;

        setRequestHeader(header: string, value: string);
        abort();
        open(method: string, url: string, async?: boolean, user?: string, password?: string): void;
        send(data?: any): void;
    }
}