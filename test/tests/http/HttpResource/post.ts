module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.post");

    var mocks = {
        raw: new mock.MockRawRequest()
    };
    var resource = new http.HttpResource<ITestObject>("/users/:userId", "userId");
    resource.createRequest = function (config: IHttpConfig) {
        return new mock.MockHttpRequest(mocks.raw)
            .config(config);
    };

    QUnit.asyncTest("post 200", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        resource.post({id: 2})
            .then(res => {
                start();
                strictEqual(res.id, 2);
            }, status => {
                start();
                strictEqual(false, status);
            });
    });

    QUnit.asyncTest("post 404", (assert) => {
        mocks.raw = mock.MockRawRequest.makeError(404, "Not Found");

        resource.post({id: 2})
            .then(res => {
                start();
                ok(false, "404 should not succeed.");
            }, status => {
                start();
                strictEqual(status.code, 404);
                strictEqual(status.text, "Not Found");
            });
    });

    QUnit.asyncTest("post (timeout)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeTimeout();

        resource.post({id: 2})
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}