module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.query");

    var mocks = {
        raw: new mock.MockRawRequest()
    };
    var resource = new http.HttpResource<ITestObject>("/users/:userId", "userId");
    resource.createRequest = function (config: IHttpConfig) {
        return new mock.MockHttpRequest(mocks.raw)
            .config(config);
    };

    QUnit.asyncTest("query 200", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", [{id: 2}], "[{ id: 2 }]");

        resource.query({})
            .then(res => {
                start();
                strictEqual(res.length, 1);
            }, status => {
                start();
                strictEqual(false, status);
            });
    });

    QUnit.asyncTest("query 404", (assert) => {
        mocks.raw = mock.MockRawRequest.makeError(404, "Not Found");

        resource.query({})
            .then(res => {
                start();
                ok(false, "404 should not succeed.");
            }, status => {
                start();
                strictEqual(status.code, 404);
                strictEqual(status.text, "Not Found");
            });
    });

    QUnit.asyncTest("query (timeout)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeTimeout();

        resource.query({})
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}