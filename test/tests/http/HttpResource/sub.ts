module luna.http.tests {
    QUnit.module("HttpResource (sub resource)");

    interface IOrganization {
        id: number;
        name: string;
    }
    interface IUser {
        id: number;
        username: string;
    }
    interface  IOrganizationResources {
        users: IHttpResource<IUser, any>;
    }

    var orgs = http.HttpResource<IOrganization, IOrganizationResources>("/orgs/:id", null, {
        users: http.HttpResource<IUser, any>("/users/:id")
    });

    QUnit.test("createUrl", (assert) => {
        var url = orgs(1).users.createUrl(2);
        strictEqual(url, "/orgs/1/users/2");
    });

    QUnit.asyncTest("get users", (assert) => {
        var mockresult = mock.MockRawRequest.makeSuccess(200, "OK", {
            id: 2,
            username: "test"
        }, "{ id: 2, username: \"test\" }");

        mock.fakeResource(orgs(1).users, mockresult).get(2)
            .then(res => {
                start();
                strictEqual(res.username, "test");
                deepEqual(mockresult.sent, {
                    method: "GET",
                    url: "/orgs/1/users/2",
                    async: true,
                    user: undefined,
                    password: undefined,
                    data: undefined,
                    headers: {}
                });
            }, status => {
                start();
                ok(false, status);
            });
    });
}