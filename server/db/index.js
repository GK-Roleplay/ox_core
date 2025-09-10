"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
var _a;
var _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Connection = void 0;
exports.GetConnection = GetConnection;
var ox_lib_1 = require("@communityox/ox_lib");
var pool_1 = require("./pool");
(_a = (_b = Symbol).dispose) !== null && _a !== void 0 ? _a : (_b.dispose = Symbol('Symbol.dispose'));
function getScalar(resp) {
    if (resp && resp[0])
        for (var key in resp[0])
            return resp[0][key];
    return null;
}
function getRow(resp) {
    return resp ? resp[0] : null;
}
var Connection = /** @class */ (function () {
    function Connection(connection) {
        this.connection = connection;
    }
    Connection.prototype.execute = function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.execute(query, values)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    Connection.prototype.query = function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.query(query, values)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    Connection.prototype.scalar = function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getScalar;
                        return [4 /*yield*/, this.execute(query, values)];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    Connection.prototype.row = function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getRow;
                        return [4 /*yield*/, this.execute(query, values)];
                    case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
                }
            });
        });
    };
    Connection.prototype.insert = function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.execute(query, values)];
                    case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.insertId];
                }
            });
        });
    };
    Connection.prototype.update = function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.execute(query, values)];
                    case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.affectedRows];
                }
            });
        });
    };
    Connection.prototype.batch = function (query, values) {
        return this.connection.batch(query, values);
    };
    Connection.prototype.beginTransaction = function () {
        this.transaction = true;
        return this.connection.beginTransaction();
    };
    Connection.prototype.rollback = function () {
        delete this.transaction;
        return this.connection.rollback();
    };
    Connection.prototype.commit = function () {
        delete this.transaction;
        return this.connection.commit();
    };
    Connection.prototype[Symbol.dispose] = function () {
        if (this.transaction)
            this.commit();
        this.connection.release();
    };
    return Connection;
}());
exports.Connection = Connection;
function GetConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!pool_1.pool) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, ox_lib_1.waitFor)(function () { return pool_1.pool; }, 'Failed to acquire database connection.', 30000)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 0];
                case 2:
                    _a = Connection.bind;
                    return [4 /*yield*/, pool_1.pool.getConnection()];
                case 3: return [2 /*return*/, new (_a.apply(Connection, [void 0, _b.sent()]))()];
            }
        });
    });
}
exports.db = {
    query: function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var env_1, conn, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        env_1 = { stack: [], error: void 0, hasError: false };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = [env_1];
                        return [4 /*yield*/, GetConnection()];
                    case 2:
                        conn = __addDisposableResource.apply(void 0, _a.concat([_b.sent(), false]));
                        return [2 /*return*/, conn.query(query, values)];
                    case 3:
                        e_1 = _b.sent();
                        env_1.error = e_1;
                        env_1.hasError = true;
                        return [3 /*break*/, 5];
                    case 4:
                        __disposeResources(env_1);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    execute: function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var env_2, conn, _a, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        env_2 = { stack: [], error: void 0, hasError: false };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        _a = [env_2];
                        return [4 /*yield*/, GetConnection()];
                    case 2:
                        conn = __addDisposableResource.apply(void 0, _a.concat([_b.sent(), false]));
                        return [2 /*return*/, conn.execute(query, values)];
                    case 3:
                        e_2 = _b.sent();
                        env_2.error = e_2;
                        env_2.hasError = true;
                        return [3 /*break*/, 5];
                    case 4:
                        __disposeResources(env_2);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    column: function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = exports.db).scalar;
                        return [4 /*yield*/, exports.db.execute(query, values)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    },
    exists: function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = exports.db).scalar;
                        return [4 /*yield*/, exports.db.execute(query, values)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()]) === 1];
                }
            });
        });
    },
    row: function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = exports.db).single;
                        return [4 /*yield*/, exports.db.execute(query, values)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    },
    insert: function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, exports.db.execute(query, values)];
                    case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.insertId];
                }
            });
        });
    },
    update: function (query, values) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, exports.db.execute(query, values)];
                    case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.affectedRows];
                }
            });
        });
    },
    batch: function (query, values) {
        return pool_1.pool.batch(query, values);
    },
    scalar: function (resp) {
        if (resp && resp[0])
            for (var key in resp[0])
                return resp[0][key];
        return null;
    },
    single: function (resp) {
        return resp ? resp[0] : null;
    },
};
