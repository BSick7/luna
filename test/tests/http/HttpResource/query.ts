module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource.query");

    var resource = http.HttpResource<ITestObject, any>("/users/:userId", "userId");

    QUnit.asyncTest("query (send)", (assert) => {
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", [{id: 2}], "[{ id: 2 }]");

        mock.fakeResource(resource, mockresult).query({name: "Test"})
            .then(res => {
                start();
                deepEqual(mockresult.sent, {
                    method: "GET",
                    url: "/users/",
                    async: true,
                    user: undefined,
                    password: undefined,
                    data: JSON.stringify({name: "Test"}),
                    headers: {}
                });
            });
    });

    QUnit.asyncTest("query 200", (assert) => {
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", [{id: 2}], "[{ id: 2 }]");

        mock.fakeResource(resource, mockresult).query({})
            .then(res => {
                start();
                strictEqual(res.length, 1);
            }, status => {
                start();
                strictEqual(false, status);
            });
    });

    QUnit.asyncTest("query 404", (assert) => {
        var mockresult = mock.MockRawRequest.makeError(404, "Not Found");

        mock.fakeResource(resource, mockresult).query({})
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
        var mockresult = mock.MockRawRequest.makeTimeout();

        mock.fakeResource(resource, mockresult).query({})
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, status => {
                start();
                strictEqual(status.isTimeout, true);
            });
    });
}