module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.get");

    var resource = http.HttpResource<ITestObject, any>("/users/:userId", "userId");

    QUnit.asyncTest("get (send)", (assert) => {
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");
        mock.fakeResource(resource, mockresult).get(2)
            .then(res => {
                start();
                deepEqual(mockresult.sent, {
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
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");
        mock.fakeResource(resource, mockresult).get(2)
            .then(res => {
                start();
                strictEqual(res.id, 2);
            }, status => {
                start();
                ok(false, status);
            });
    });

    QUnit.asyncTest("get 404", (assert) => {
        var mockresult = mock.MockRawRequest.makeError(404, "Not Found");
        mock.fakeResource(resource, mockresult).get(2)
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
        var mockresult = mock.MockRawRequest.makeTimeout();
        mock.fakeResource(resource, mockresult).get(2)
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}