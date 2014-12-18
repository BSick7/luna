module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.post");

    var resource = http.HttpResource<ITestObject, any>("/users/:userId", "userId");

    QUnit.asyncTest("post (send)", (assert) => {
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        mock.fakeResource(resource, mockresult).post({id: 2})
            .then(res => {
                start();
                deepEqual(mockresult.sent, {
                    method: "POST",
                    url: "/users/",
                    async: true,
                    user: undefined,
                    password: undefined,
                    data: JSON.stringify({id: 2}),
                    headers: {}
                });
            });
    });

    QUnit.asyncTest("post 200", (assert) => {
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        mock.fakeResource(resource, mockresult).post({id: 2})
            .then(res => {
                start();
                strictEqual(res.id, 2);
            }, status => {
                start();
                strictEqual(false, status);
            });
    });

    QUnit.asyncTest("post 404", (assert) => {
        var mockresult = mock.MockRawRequest.makeError(404, "Not Found");

        mock.fakeResource(resource, mockresult).post({id: 2})
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
        var mockresult = mock.MockRawRequest.makeTimeout();

        mock.fakeResource(resource, mockresult).post({id: 2})
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}