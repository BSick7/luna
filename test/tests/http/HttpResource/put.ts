module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.put");

    var mocks = {
        raw: new mock.MockRawRequest()
    };
    var resource = http.HttpResource<ITestObject, any>("/users/:userId", "userId");
    resource.createRequest = function (config: IHttpConfig) {
        return new mock.MockHttpRequest(mocks.raw)
            .config(config);
    };

    QUnit.asyncTest("put (send)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        resource.put(2, {id: 2})
            .then(res => {
                start();
                deepEqual(mocks.raw.sent, {
                    method: "PUT",
                    url: "/users/2",
                    async: true,
                    user: undefined,
                    password: undefined,
                    data: JSON.stringify({id: 2}),
                    headers: {}
                });
            });
    });

    QUnit.asyncTest("put 200", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        resource.put(2, {id: 2})
            .then(res => {
                start();
                strictEqual(res.id, 2);
            }, status => {
                start();
                strictEqual(false, status);
            });
    });

    QUnit.asyncTest("put 404", (assert) => {
        mocks.raw = mock.MockRawRequest.makeError(404, "Not Found");

        resource.put(2, {id: 2})
            .then(res => {
                start();
                ok(false, "404 should not succeed.");
            }, status => {
                start();
                strictEqual(status.code, 404);
                strictEqual(status.text, "Not Found");
            });
    });

    QUnit.asyncTest("put (timeout)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeTimeout();

        resource.put(2, {id: 2})
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}