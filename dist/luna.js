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
                this.$$xhr = new XMLHttpRequest();
                this.$$promise = new Promise(function (resolve, reject) {
                    _this.$$resolve = resolve;
                    _this.$$reject = reject;
                });
            }
            HttpRequest.prototype.url = function (url) {
                this.$$config.url = url;
                return this;
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
                this.$$xhr.setRequestHeader(name, value);
                return this;
            };
            HttpRequest.prototype.send = function (data) {
                var _this = this;
                var config = this.$$config;
                var xhr = this.$$xhr;
                xhr.timeout = config.timeout || 0;
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
            HttpRequest.prototype.$$isError = function (response) {
                return response.status !== 200;
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
        var HttpResponse = (function () {
            function HttpResponse(xhr) {
                this.isCancel = false;
                this.isTimeout = false;
                this.$$xhr = xhr;
            }
            Object.defineProperty(HttpResponse.prototype, "status", {
                get: function () {
                    return this.$$xhr.status;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HttpResponse.prototype, "statusText", {
                get: function () {
                    return this.$$xhr.statusText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HttpResponse.prototype, "response", {
                get: function () {
                    return this.$$xhr.response;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(HttpResponse.prototype, "responseText", {
                get: function () {
                    return this.$$xhr.responseText;
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
//# sourceMappingURL=luna.js.map