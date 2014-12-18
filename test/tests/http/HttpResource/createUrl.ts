module luna.http.tests {
    QUnit.module("HttpResource.createUrl");

    QUnit.test("createUrl (without id)", (assert) => {
        var res = http.HttpResource("/users/:id");
        var url = res.createUrl();
        strictEqual(url, "/users/");

        var res2 = http.HttpResource("/users/:userId", "userId");
        var url = res2.createUrl();
        strictEqual(url, "/users/");
    });

    QUnit.test("createUrl (with id)", (assert) => {
        var res = http.HttpResource("/users/:id");
        var url = res.createUrl(1);
        strictEqual(url, "/users/1");

        var res2 = http.HttpResource("/users/:userId", "userId");
        var url = res2.createUrl(1);
        strictEqual(url, "/users/1");
    });
}