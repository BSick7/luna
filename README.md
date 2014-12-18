luna
====

Data and web services framework


### Create Resource

By default, resource uses `id` field.

```
interface IUser {
    id: number;
}
var resource = new luna.http.HttpResource<IUser>("/users/:id");
resource.get(1)
    .then(user => {
        //user.id
    }, status => {
        //status.code
        //status.text
        //status.isTimeout
        //status.isCancel
    });
```

This can be changed to use other fields like `uid`.

```
interface IUser {
    uid: string;
}
var resource = new luna.http.HttpResource<IUser>("/users/:uid", "uid");
resource.get(...)
    .then(user => {
        //user.uid
    }, status => {
        //status.code
        //status.text
        //status.isTimeout
        //status.isCancel
    });
```


### Sub Resources

```
interface IUser {
    id: number;
    username: string;
}
interface IOrganization {
    id: number;
    name: string;
}
interface IOrganizationResource {
    users: HttpResource<IUser>
}

var orgs = luna.http.HttpResource<IOrganization>("/orgs/:id")
    .sub<IOrganizationResource>({
        users: luna.http.HttpResource<IUser>("/users/:id")
    });

orgs.get(1).then(org => { }); //Get organization with id: 1
orgs(1).users.get(2).then(user => { }); //Get user with id: 2 in organization id: 1
```
