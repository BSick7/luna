module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.remove");

    var resource = http.HttpResource<ITestObject, any>("/users/:userId", "userId");

    QUnit.asyncTest("remove (send)", (assert) => {
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        mock.fakeResource(resource, mockresult).remove(2)
            .then(res => {
                start();
                deepEqual(mockresult.sent, {
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
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", undefined, "");

        mock.fakeResource(resource, mockresult).remove(2)
            .then(res => {
                start();
                ok(true);
            }, status => {
                start();
                strictEqual(false, status);
            });
    });

    QUnit.asyncTest("remove 404", (assert) => {
        var mockresult = mock.MockRawRequest.makeError(404, "Not Found");

        mock.fakeResource(resource, mockresult).remove(2)
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
        var mockresult = mock.MockRawRequest.makeTimeout();

        mock.fakeResource(resource, mockresult).remove(2)
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}