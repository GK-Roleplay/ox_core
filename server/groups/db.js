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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectGroups = SelectGroups;
exports.InsertGroup = InsertGroup;
exports.RemoveGroup = RemoveGroup;
exports.AddCharacterGroup = AddCharacterGroup;
exports.UpdateCharacterGroup = UpdateCharacterGroup;
exports.RemoveCharacterGroup = RemoveCharacterGroup;
exports.GetCharacterGroups = GetCharacterGroups;
exports.SetActiveGroup = SetActiveGroup;
var db_1 = require("db");
function SelectGroups() {
    return db_1.db.query("\n    SELECT \n      ox_groups.*,\n      JSON_OBJECTAGG(ox_group_grades.grade, ox_group_grades.accountRole) AS accountRoles,\n      JSON_ARRAYAGG(ox_group_grades.label ORDER BY ox_group_grades.grade) AS grades\n    FROM \n        ox_groups\n    JOIN \n        ox_group_grades\n    ON\n        ox_groups.name = ox_group_grades.group\n    GROUP BY \n        ox_groups.name;\n  ");
}
function InsertGroup(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var env_1, conn, _c, insertedGroup, insertedGrades, e_1;
        var name = _b.name, label = _b.label, type = _b.type, colour = _b.colour, hasAccount = _b.hasAccount, grades = _b.grades, accountRoles = _b.accountRoles;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    env_1 = { stack: [], error: void 0, hasError: false };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, 7, 8]);
                    _c = [env_1];
                    return [4 /*yield*/, (0, db_1.GetConnection)()];
                case 2:
                    conn = __addDisposableResource.apply(void 0, _c.concat([_d.sent(), false]));
                    return [4 /*yield*/, conn.beginTransaction()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, conn.update('INSERT IGNORE INTO `ox_groups` (`name`, `label`, `type`, `colour`, `hasAccount`) VALUES (?, ?, ?, ?, ?)', [name, label, type, colour, hasAccount])];
                case 4:
                    insertedGroup = _d.sent();
                    if (!insertedGroup)
                        return [2 /*return*/, true];
                    return [4 /*yield*/, conn.batch('INSERT INTO `ox_group_grades` (`group`, `grade`, `label`, `accountRole`) VALUES (?, ?, ?, ?)', grades.map(function (gradeLabel, index) { return [name, index + 1, gradeLabel, accountRoles[index + 1]]; }))];
                case 5:
                    insertedGrades = (_d.sent());
                    return [2 /*return*/, insertedGrades.affectedRows > 0];
                case 6:
                    e_1 = _d.sent();
                    env_1.error = e_1;
                    env_1.hasError = true;
                    return [3 /*break*/, 8];
                case 7:
                    __disposeResources(env_1);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function RemoveGroup(groupName) {
    return db_1.db.update('DELETE FROM `ox_groups` WHERE name = ?', [groupName]);
}
function AddCharacterGroup(charId, name, grade) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update('INSERT INTO character_groups (charId, name, grade) VALUES (?, ?, ?)', [charId, name, grade])];
                case 1: return [2 /*return*/, ((_a.sent()) ===
                        1)];
            }
        });
    });
}
function UpdateCharacterGroup(charId, name, grade) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update('UPDATE character_groups SET grade = ? WHERE charId = ? AND name = ?', [grade, charId, name])];
                case 1: return [2 /*return*/, ((_a.sent()) ===
                        1)];
            }
        });
    });
}
function RemoveCharacterGroup(charId, name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update('DELETE FROM character_groups WHERE charId = ? AND name = ?', [charId, name])];
                case 1: return [2 /*return*/, (_a.sent()) === 1];
            }
        });
    });
}
function GetCharacterGroups(charId) {
    return db_1.db.execute('SELECT name, grade, isActive FROM character_groups WHERE charId = ?', [charId]);
}
function SetActiveGroup(charId, groupName) {
    return __awaiter(this, void 0, void 0, function () {
        var env_2, conn, _a, params, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    env_2 = { stack: [], error: void 0, hasError: false };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    _a = [env_2];
                    return [4 /*yield*/, (0, db_1.GetConnection)()];
                case 2:
                    conn = __addDisposableResource.apply(void 0, _a.concat([_b.sent(), false]));
                    params = [charId];
                    conn.execute('UPDATE character_groups SET isActive = 0 WHERE charId = ? AND isActive = 1', params);
                    if (groupName) {
                        params.push(groupName);
                        conn.execute('UPDATE character_groups SET isActive = 1 WHERE charId = ? AND name = ?', params);
                    }
                    return [3 /*break*/, 5];
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
}
