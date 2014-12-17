module luna.http {
    export class HttpResource<T> {
        private $$templateParts: string[];
        private $$idField: string;

        constructor (templateUrl: string, idField?: string) {
            this.$$templateParts = templateUrl.split('/');
            this.$$idField = idField || "id";
        }

        get (id: any): Promise<T> {
            return new Promise((resolve, reject) => {
                return this
                    .createRequest({
                        method: 'GET',
                        type: 'json',
                        url: this.createUrl(id)
                    })
                    .send()
                    .then(res => resolve(res.response), reject);
            });
        }

        query (query: any): Promise<T[]> {
            return new Promise((resolve, reject) => {
                this
                    .createRequest({
                        method: 'GET',
                        type: 'json',
                        url: this.createUrl()
                    })
                    .send(JSON.stringify(query))
                    .then(res => resolve(res.response), reject);
            });
        }

        post (t: T): Promise<T> {
            return new Promise((resolve, reject) => {
                this
                    .createRequest({
                        method: 'POST',
                        type: 'json',
                        url: this.createUrl()
                    })
                    .send(JSON.stringify(t))
                    .then(res => resolve(res.response), reject);
            });
        }

        put (id: any, t: T): Promise<T> {
            return new Promise((resolve, reject) => {
                this
                    .createRequest({
                        method: 'PUT',
                        type: 'json',
                        url: this.createUrl(id)
                    })
                    .send(JSON.stringify(t))
                    .then(res => resolve(res.response), reject);
            });
        }

        remove (id: any): Promise<any> {
            return new Promise((resolve, reject) => {
                this
                    .createRequest({
                        method: 'DELETE',
                        type: 'json',
                        url: this.createUrl(id)
                    })
                    .send()
                    .then(res => resolve(res.response), reject);
            });
        }

        createUrl (id?: any): string {
            return this.$$templateParts
                .join('/')
                .replace(':' + this.$$idField, id.toString());
        }

        createRequest (config: IHttpConfig): IHttpRequest {
            return new HttpRequest()
                .config(config);
        }
    }
}