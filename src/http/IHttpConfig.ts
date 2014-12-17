module luna.http {
    export interface IHttpConfig {
        method: string;
        url: string;
        user?: string;
        password?: string;
        timeout?: number;
        type?: string;
    }
}