module luna.http {
    export class HttpResource<T> {
        private $$templateParts: string[];
        private $$idField: string;

        constructor (templateUrl: string, idField?: string) {
            this.$$templateParts = templateUrl.split('/');
            this.$$idField = "id";
        }

        get (id: any): Promise<T> {
            var request = new HttpRequest()
                .config({
                    method: 'GET',
                    url: this.createUrl(id)
                })
                .send();
            return new Promise((resolve, reject) => {
                request.then(res => resolve(res.response), reject);
            });
        }

        query (query: any): Thenable<T[]> {
            var request = new HttpRequest()
                .config({
                    method: 'GET',
                    url: this.createUrl()
                })
                .send(JSON.stringify(query));
            return new Promise((resolve, reject) => {
                request.then(res => resolve(res.response), reject);
            });
        }

        post (t: T): Promise<T> {
            var request = new HttpRequest()
                .config({
                    method: 'POST',
                    type: 'json',
                    url: this.createUrl()
                })
                .send(JSON.stringify(t));
            return new Promise((resolve, reject) => {
                request.then(res => resolve(res.response), reject);
            });
        }

        put (id: any, t: T): Promise<T> {
            var request = new HttpRequest()
                .config({
                    method: 'PUT',
                    type: 'json',
                    url: this.createUrl(id)
                })
                .send(JSON.stringify(t));
            return new Promise((resolve, reject) => {
                request.then(res => resolve(res.response), reject);
            });
        }

        remove (id: any): Promise<any> {
            var request = new HttpRequest()
                .config({
                    method: 'DELETE',
                    type: 'json',
                    url: this.createUrl(id)
                })
                .send();
            return new Promise((resolve, reject) => {
                request.then(res => resolve(res.response), reject);
            });
        }

        createUrl (id?: any): string {
            return this.$$templateParts
                .join('/')
                .replace(':' + this.$$idField, id.toString());
        }
    }
}