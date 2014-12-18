module luna.http.mock {
    export class MockHttpRequest extends HttpRequest {
        constructor (public raw: MockRawRequest) {
            super();
        }

        createRawRequest (): IRawRequest {
            return this.raw;
        }
    }
}