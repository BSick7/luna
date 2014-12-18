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
    }, reason => {
        //reason.status
        //reason.statusText
        //reason.isTimeout
        //reason.isCancel
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
    }, reason => {
        //reason.status
        //reason.statusText
        //reason.isTimeout
        //reason.isCancel
    });
```