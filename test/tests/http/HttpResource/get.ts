module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.get");

    var mocks = {
        raw: new mock.MockRawRequest()
    };
    var resource = http.HttpResource<ITestObject, any>("/users/:userId", "userId");
    resource.createRequest = function (config: IHttpConfig) {
        return new mock.MockHttpRequest(mocks.raw)
            .config(config);
    };

    QUnit.asyncTest("get (send)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        resource.get(2)
            .then(res => {
                start();
                deepEqual(mocks.raw.sent, {
                    method: "GET",
                    url: "/users/2",
                    async: true,
                    user: undefined,
                    password: undefined,
                    data: undefined,
                    headers: {}
                });
            });
    });

    QUnit.asyncTest("get 200", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        resource.get(2)
            .then(res => {
                start();
                strictEqual(res.id, 2);
            }, status => {
                start();
                strictEqual(false, status);
            });
    });

    QUnit.asyncTest("get 404", (assert) => {
        mocks.raw = mock.MockRawRequest.makeError(404, "Not Found");

        resource.get(2)
            .then(res => {
                start();
                ok(false, "404 should not succeed.");
            }, status => {
                start();
                strictEqual(status.code, 404);
                strictEqual(status.text, "Not Found");
            });
    });

    QUnit.asyncTest("get (timeout)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeTimeout();

        resource.get(2)
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}