module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.remove");

    var mocks = {
        raw: new mock.MockRawRequest()
    };
    var resource = new http.HttpResource<ITestObject>("/users/:userId", "userId");
    resource.createRequest = function (config: IHttpConfig) {
        return new mock.MockHttpRequest(mocks.raw)
            .config(config);
    };

    QUnit.asyncTest("remove (send)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        resource.remove(2)
            .then(res => {
                start();
                deepEqual(mocks.raw.sent, {
                    method: "DELETE",
                    url: "/users/2",
                    async: true,
                    user: undefined,
                    password: undefined,
                    data: undefined,
                    headers: {}
                });
            });
    });

    QUnit.asyncTest("remove 200", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", undefined, "");

        resource.remove(2)
            .then(res => {
                start();
                ok(true);
            }, status => {
                start();
                strictEqual(false, status);
            });
    });

    QUnit.asyncTest("remove 404", (assert) => {
        mocks.raw = mock.MockRawRequest.makeError(404, "Not Found");

        resource.remove(2)
            .then(res => {
                start();
                ok(false, "404 should not succeed.");
            }, status => {
                start();
                strictEqual(status.code, 404);
                strictEqual(status.text, "Not Found");
            });
    });

    QUnit.asyncTest("remove (timeout)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeTimeout();

        resource.remove(2)
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}