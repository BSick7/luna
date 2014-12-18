var luna;
(function (luna) {
    luna.version = '0.1.0';
})(luna || (luna = {}));
var luna;
(function (luna) {
    var http;
    (function (http) {
        var HttpRequest = (function () {
            function HttpRequest() {
                var _this = this;
                this.$$promise = new Promise(function (resolve, reject) {
                    _this.$$resolve = resolve;
                    _this.$$reject = reject;
                });
            }
            HttpRequest.prototype.createRawRequest = function () {
                return new XMLHttpRequest();
            };
            HttpRequest.prototype.config = function (config) {
                var curconfig = this.$$config = this.$$config || { method: "GET", url: "" };
                for (var i = 0, keys = Object.keys(config); i < keys.length; i++) {
                    var key = keys[i];
                    curconfig[key] = config[key];
                }
                return this;
            };
            HttpRequest.prototype.header = function (name, value) {
                this.$$xhr = this.$$xhr || this.createRawRequest();
                this.$$xhr.setRequestHeader(name, value);
                return this;
            };
            HttpRequest.prototype.send = function (data) {
                var _this = this;
                var config = this.$$config;
                var xhr = this.$$xhr = this.$$xhr || this.createRawRequest();
                xhr.timeout = config.timeout || 0;
                xhr.responseType = config.type || "";
                xhr.open(config.method, config.url, true, config.user, config.password);
                xhr.send(data);
                xhr.ontimeout = function (ev) { return _this.$$reject(http.HttpResponse.timeout(xhr)); };
                xhr.onerror = function (ev) { return _this.$$reject(http.HttpResponse.normal(xhr)); };
                xhr.onload = function (ev) {
                    var response = http.HttpResponse.normal(xhr);
                    _this.$$isError(response) ? _this.$$reject(response) : _this.$$resolve(response);
                };
                return this;
            };
            HttpRequest.prototype.cancel = function () {
                if (!this.$$xhr)
                    return false;
                this.$$xhr.abort();
                this.$$reject(http.HttpResponse.cancel(this.$$xhr));
                return true;
            };
            HttpRequest.prototype.$$isError = function (status) {
                return status.code >= 400;
            };
            HttpRequest.prototype.then = function (onFulfilled, onRejected) {
                return this.$$promise.then(onFulfilled, onRejected);
            };
            return HttpRequest;
        })();
        http.HttpRequest = HttpRequest;
    })(http = luna.http || (luna.http = {}));
})(luna || (luna = {}));
var luna;
(function (luna) {
    var http;
    (function (http) {
        function HttpResource(templateUrl, idField, subs) {
            idField = idField || "id";
            var res = function (baseId) {
                if (!subs)
                    return {};
                var actual = {};
                var baseUrl = templateUrl.replace(':' + idField, baseId.toString());
                for (var i = 0, keys = Object.keys(subs); i < keys.length; i++) {
                    var key = keys[i];
                    Object.defineProperty(actual, key, {
                        get: function () {
                            return SubHttpResource(baseUrl, subs[key]);
                        }
                    });
                }
                Object.freeze(actual);
                return actual;
            };
            res.templateUrl = templateUrl;
            res.idField = idField;
            res.$$subs = subs;
            res.get = HiddenHttpResource.prototype.get.bind(res);
            res.query = HiddenHttpResource.prototype.query.bind(res);
            res.post = HiddenHttpResource.prototype.post.bind(res);
            res.put = HiddenHttpResource.prototype.put.bind(res);
            res.remove = HiddenHttpResource.prototype.remove.bind(res);
            res.createUrl = function (id) {
                return templateUrl.replace(':' + idField, (id != null) ? id.toString() : '');
            };
            res.createRequest = HiddenHttpResource.prototype.createRequest.bind(res);
            return res;
        }
        http.HttpResource = HttpResource;
        function SubHttpResource(baseUrl, resource) {
            return HttpResource(baseUrl + resource.templateUrl, resource.idField, resource.$$subs);
        }
        http.SubHttpResource = SubHttpResource;
        var HiddenHttpResource = (function () {
            function HiddenHttpResource() {
            }
            HiddenHttpResource.prototype.get = function (id) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    return _this.createRequest({
                        method: 'GET',
                        type: 'json',
                        url: _this.createUrl(id)
                    }).send().then(function (res) { return resolve(res.response); }, reject);
                });
            };
            HiddenHttpResource.prototype.query = function (query) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.createRequest({
                        method: 'GET',
                        type: 'json',
                        url: _this.createUrl()
                    }).send(JSON.stringify(query)).then(function (res) { return resolve(res.response); }, reject);
                });
            };
            HiddenHttpResource.prototype.post = function (t) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.createRequest({
                        method: 'POST',
                        type: 'json',
                        url: _this.createUrl()
                    }).send(JSON.stringify(t)).then(function (res) { return resolve(res.response); }, reject);
                });
            };
            HiddenHttpResource.prototype.put = function (id, t) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.createRequest({
                        method: 'PUT',
                        type: 'json',
                        url: _this.createUrl(id)
                    }).send(JSON.stringify(t)).then(function (res) { return resolve(res.response); }, reject);
                });
            };
            HiddenHttpResource.prototype.remove = function (id) {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    _this.createRequest({
                        method: 'DELETE',
                        type: 'json',
                        url: _this.createUrl(id)
                    }).send().then(function (res) { return resolve(res.response); }, reject);
                });
            };
            HiddenHttpResource.prototype.createUrl = function (id) {
                return "";
            };
            HiddenHttpResource.prototype.createRequest = function (config) {
                return new http.HttpRequest().config(config);
            };
            return HiddenHttpResource;
        })();
    })(http = luna.http || (luna.http = {}));
})(luna || (luna = {}));
var luna;
(function (luna) {
    var http;
    (function (http) {
        var HttpResponse = (function () {
            function HttpResponse(xhr) {
                this.isCancel = false;
                this.isTimeout = false;
                this.$$raw = xhr;
            }
            Object.defineProperty(HttpResponse.prototype, "code", {
                get: function () {
                    return this.$$raw.status;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HttpResponse.prototype, "text", {
                get: function () {
                    return this.$$raw.statusText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HttpResponse.prototype, "response", {
                get: function () {
                    return this.$$raw.response;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HttpResponse.prototype, "responseText", {
                get: function () {
                    return this.$$raw.responseText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HttpResponse.prototype, "responseJson", {
                get: function () {
                    if (this.$$raw.responseType === "json")
                        return this.$$raw.response;
                    return JSON.parse(this.$$raw.responseText);
                },
                enumerable: true,
                configurable: true
            });
            HttpResponse.normal = function (xhr) {
                var response = new HttpResponse(xhr);
                Object.freeze(this);
                return response;
            };
            HttpResponse.timeout = function (xhr) {
                var response = new HttpResponse(xhr);
                response.isTimeout = true;
                Object.freeze(this);
                return response;
            };
            HttpResponse.cancel = function (xhr) {
                var response = new HttpResponse(xhr);
                response.isCancel = true;
                Object.freeze(this);
                return response;
            };
            return HttpResponse;
        })();
        http.HttpResponse = HttpResponse;
    })(http = luna.http || (luna.http = {}));
})(luna || (luna = {}));
var luna;
(function (luna) {
    var polyfill;
    (function (polyfill) {
        if (!Function.prototype.bind) {
            Function.prototype.bind = function (oThis) {
                if (typeof this !== 'function') {
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }
                var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
                }, fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
                };
                fNOP.prototype = this.prototype;
                fBound.prototype = new fNOP();
                return fBound;
            };
        }
    })(polyfill = luna.polyfill || (luna.polyfill = {}));
})(luna || (luna = {}));
//# sourceMappingURL=luna.js.map