module luna.http.mock {
    export function fakeResource<T,TSub>(resource: IHttpResource<T, TSub>, result: MockRawRequest): IHttpResource<T, TSub> {
        resource.createRequest = function (config: IHttpConfig) {
            return new mock.MockHttpRequest(result)
                .config(config);
        };
        return resource;
    }
}