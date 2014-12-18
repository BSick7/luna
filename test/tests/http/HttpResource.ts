module luna.http.tests {
    interface ITestObject {
        id: number;
    }

    QUnit.module("HttpResource");

    var mocks = {
        raw: new mock.MockRawRequest()
    };
    var resource = new http.HttpResource<ITestObject>("/users/:userId", "userId");
    resource.createRequest = function (config: IHttpConfig) {
        return new mock.MockHttpRequest(mocks.raw)
            .config(config);
    };

    QUnit.test("createUrl (without id)", (assert) => {
        var res = new http.HttpResource("/users/:id");
        var url = res.createUrl();
        strictEqual(url, "/users/");

        var res2 = new http.HttpResource("/users/:userId", "userId");
        var url = res2.createUrl();
        strictEqual(url, "/users/");
    });

    QUnit.test("createUrl (with id)", (assert) => {
        var res = new http.HttpResource("/users/:id");
        var url = res.createUrl(1);
        strictEqual(url, "/users/1");

        var res2 = new http.HttpResource("/users/:userId", "userId");
        var url = res2.createUrl(1);
        strictEqual(url, "/users/1");
    });

    QUnit.asyncTest("GET 200", (assert) => {
        mocks.raw = mock.MockRawRequest.makeSuccess(200, "OK", {id: 2}, "{ id: 2 }");

        resource.get(2)
            .then(res => {
                start();
                strictEqual(res.id, 2);
            }, reason => {
                start();
                strictEqual(false, reason);
            });
    });

    QUnit.asyncTest("GET 404", (assert) => {
        mocks.raw = mock.MockRawRequest.makeError(404, "Not Found");

        resource.get(2)
            .then(res => {
                start();
                ok(false, "404 should not succeed.");
            }, reason => {
                start();
                strictEqual(reason.status, 404);
                strictEqual(reason.statusText, "Not Found");
            });
    });

    QUnit.asyncTest("GET (timeout)", (assert) => {
        mocks.raw = mock.MockRawRequest.makeTimeout();

        resource.get(2)
            .then(res => {
                start();
                ok(false, "Timeout should not succeed.");
            }, reason => {
                start();
                strictEqual(reason.isTimeout, true);
            });
    });
}