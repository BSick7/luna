module luna.http {
    export interface IHttpResource<T, TSub> {
        templateUrl: string;
        idField: string;
        (baseId: any): TSub;
        get(id: any): Promise<T>;
        query(query: any): Promise<T[]>;
        post(t: T): Promise<T>;
        put(id: any, t: T): Promise<T>;
        remove(id: any): Promise<any>;
        createUrl(id?: any): string;
        createRequest (config: IHttpConfig): IHttpRequest;
    }

    export function HttpResource<T, TSub>(templateUrl: string, idField?: string, subs?: any) {
        idField = idField || "id";

        var res: IHttpResource<T, TSub> = <any>function (baseId: any): TSub {
            if (!subs)
                return <any>{};

            var actual = {};
            var baseUrl = templateUrl.replace(':' + idField, baseId.toString());
            for (var i = 0, keys = Object.keys(subs); i < keys.length; i++) {
                var key = keys[i];
                Object.defineProperty(actual, key, {
                    get: function () {
                        return SubHttpResource(baseUrl, subs[key]);
                    }
                });
            }
            Object.freeze(actual);
            return <TSub>actual;
        };

        res.templateUrl = templateUrl;
        res.idField = idField;
        (<any>res).$$subs = subs;

        res.get = HiddenHttpResource.prototype.get.bind(res);
        res.query = HiddenHttpResource.prototype.query.bind(res);
        res.post = HiddenHttpResource.prototype.post.bind(res);
        res.put = HiddenHttpResource.prototype.put.bind(res);
        res.remove = HiddenHttpResource.prototype.remove.bind(res);
        res.createUrl = function (id?: any): string {
            return templateUrl.replace(':' + idField, (id != null) ? id.toString() : '');
        };
        res.createRequest = HiddenHttpResource.prototype.createRequest.bind(res);

        return res;
    }

    export function SubHttpResource<T, TSub>(baseUrl: string, resource: IHttpResource<T, TSub>): IHttpResource<T, TSub> {
        return HttpResource<T, TSub>(baseUrl + resource.templateUrl, resource.idField, (<any>resource).$$subs);
    }

    class HiddenHttpResource<T, TSub> {
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
            return "";
        }

        createRequest (config: IHttpConfig): IHttpRequest {
            return new HttpRequest()
                .config(config);
        }
    }
}