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
exports.UpdateBalance = UpdateBalance;
exports.PerformTransaction = PerformTransaction;
exports.SelectAccounts = SelectAccounts;
exports.SelectDefaultAccountId = SelectDefaultAccountId;
exports.SelectAccount = SelectAccount;
exports.IsAccountIdAvailable = IsAccountIdAvailable;
exports.CreateNewAccount = CreateNewAccount;
exports.DeleteAccount = DeleteAccount;
exports.SelectAccountRole = SelectAccountRole;
exports.DepositMoney = DepositMoney;
exports.WithdrawMoney = WithdrawMoney;
exports.UpdateAccountAccess = UpdateAccountAccess;
exports.UpdateInvoice = UpdateInvoice;
exports.CreateInvoice = CreateInvoice;
exports.DeleteInvoice = DeleteInvoice;
exports.SetAccountType = SetAccountType;
var ox_lib_1 = require("@communityox/ox_lib");
var class_1 = require("accounts/class");
var db_1 = require("db");
var class_2 = require("player/class");
var locales_1 = require("../../common/locales");
var roles_1 = require("./roles");
var addBalance = 'UPDATE accounts SET balance = balance + ? WHERE id = ?';
var removeBalance = 'UPDATE accounts SET balance = balance - ? WHERE id = ?';
var safeRemoveBalance = "".concat(removeBalance, " AND (balance - ?) >= 0");
var addTransaction = 'INSERT INTO accounts_transactions (actorId, fromId, toId, amount, message, note, fromBalance, toBalance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
var getBalance = 'SELECT balance FROM accounts WHERE id = ?';
var doesAccountExist = 'SELECT 1 FROM accounts WHERE id = ?';
function GenerateAccountId(conn) {
    return __awaiter(this, void 0, void 0, function () {
        var date, year, month, baseId, accountId, existingId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    date = new Date();
                    year = date.getFullYear().toString().slice(-2);
                    month = ('0' + (date.getMonth() + 1)).slice(-2);
                    baseId = Number(year + month) * 1e3;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    accountId = (0, ox_lib_1.getRandomInt)(10, 99) * 1e7 + baseId + (0, ox_lib_1.getRandomInt)(0, 9999);
                    return [4 /*yield*/, conn.scalar(doesAccountExist, [accountId])];
                case 2:
                    existingId = _a.sent();
                    if (!existingId)
                        return [2 /*return*/, accountId];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function UpdateBalance(accountId, amount, action, overdraw, message, note, actorId) {
    return __awaiter(this, void 0, void 0, function () {
        var env_1, conn, _a, balance, addAction, success, _b, didUpdate, e_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    env_1 = { stack: [], error: void 0, hasError: false };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 9, 10, 11]);
                    amount = Number.parseInt(String(amount));
                    if (isNaN(amount))
                        return [2 /*return*/, { success: false, message: 'amount_not_number' }];
                    if (amount <= 0)
                        return [2 /*return*/, { success: false, message: 'invalid_amount' }];
                    _a = [env_1];
                    return [4 /*yield*/, (0, db_1.GetConnection)()];
                case 2:
                    conn = __addDisposableResource.apply(void 0, _a.concat([_c.sent(), false]));
                    return [4 /*yield*/, conn.scalar(getBalance, [accountId])];
                case 3:
                    balance = _c.sent();
                    if (balance === null)
                        return [2 /*return*/, {
                                success: false,
                                message: 'no_balance',
                            }];
                    addAction = action === 'add';
                    if (!addAction) return [3 /*break*/, 5];
                    return [4 /*yield*/, conn.update(addBalance, [amount, accountId])];
                case 4:
                    _b = _c.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, conn.update(overdraw ? removeBalance : safeRemoveBalance, [amount, accountId, amount])];
                case 6:
                    _b = _c.sent();
                    _c.label = 7;
                case 7:
                    success = _b;
                    if (!success)
                        return [2 /*return*/, {
                                success: false,
                                message: 'insufficient_balance',
                            }];
                    !message && (message = (0, locales_1.default)(action === 'add' ? 'deposit' : 'withdraw'));
                    return [4 /*yield*/, conn.update(addTransaction, [
                            actorId || null,
                            addAction ? null : accountId,
                            addAction ? accountId : null,
                            amount,
                            message,
                            note,
                            addAction ? null : balance - amount,
                            addAction ? balance + amount : null,
                        ])];
                case 8:
                    didUpdate = (_c.sent()) === 1;
                    if (!didUpdate)
                        return [2 /*return*/, {
                                success: false,
                                message: 'something_went_wrong',
                            }];
                    emit('ox:updatedBalance', { accountId: accountId, amount: amount, action: action });
                    return [2 /*return*/, { success: true }];
                case 9:
                    e_1 = _c.sent();
                    env_1.error = e_1;
                    env_1.hasError = true;
                    return [3 /*break*/, 11];
                case 10:
                    __disposeResources(env_1);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function PerformTransaction(fromId, toId, amount, overdraw, message, note, actorId) {
    return __awaiter(this, void 0, void 0, function () {
        var env_2, conn, _a, fromBalance, toBalance, query, values, removedBalance, addedBalance, _b, e_2, e_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    env_2 = { stack: [], error: void 0, hasError: false };
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 14, 15, 16]);
                    amount = Number.parseInt(String(amount));
                    if (isNaN(amount))
                        return [2 /*return*/, { success: false, message: 'amount_not_number' }];
                    if (amount <= 0)
                        return [2 /*return*/, { success: false, message: 'invalid_amount' }];
                    _a = [env_2];
                    return [4 /*yield*/, (0, db_1.GetConnection)()];
                case 2:
                    conn = __addDisposableResource.apply(void 0, _a.concat([_c.sent(), false]));
                    return [4 /*yield*/, conn.scalar(getBalance, [fromId])];
                case 3:
                    fromBalance = _c.sent();
                    return [4 /*yield*/, conn.scalar(getBalance, [toId])];
                case 4:
                    toBalance = _c.sent();
                    if (fromBalance === null || toBalance === null)
                        return [2 /*return*/, { success: false, message: 'no_balance' }];
                    return [4 /*yield*/, conn.beginTransaction()];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 12, , 13]);
                    query = overdraw ? removeBalance : safeRemoveBalance;
                    values = [amount, fromId];
                    if (!overdraw)
                        values.push(amount);
                    return [4 /*yield*/, conn.update(query, values)];
                case 7:
                    removedBalance = _c.sent();
                    _b = removedBalance;
                    if (!_b) return [3 /*break*/, 9];
                    return [4 /*yield*/, conn.update(addBalance, [amount, toId])];
                case 8:
                    _b = (_c.sent());
                    _c.label = 9;
                case 9:
                    addedBalance = _b;
                    if (!addedBalance) return [3 /*break*/, 11];
                    return [4 /*yield*/, conn.execute(addTransaction, [
                            actorId,
                            fromId,
                            toId,
                            amount,
                            message !== null && message !== void 0 ? message : (0, locales_1.default)('transfer'),
                            note,
                            fromBalance - amount,
                            toBalance + amount,
                        ])];
                case 10:
                    _c.sent();
                    emit('ox:transferredMoney', { fromId: fromId, toId: toId, amount: amount });
                    return [2 /*return*/, { success: true }];
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_2 = _c.sent();
                    console.error("Failed to transfer $".concat(amount, " from account<").concat(fromId, "> to account<").concat(toId, ">"));
                    console.log(e_2);
                    return [3 /*break*/, 13];
                case 13:
                    conn.rollback();
                    return [2 /*return*/, { success: false, message: 'something_went_wrong' }];
                case 14:
                    e_3 = _c.sent();
                    env_2.error = e_3;
                    env_2.hasError = true;
                    return [3 /*break*/, 16];
                case 15:
                    __disposeResources(env_2);
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function SelectAccounts(column, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, db_1.db.execute("SELECT * FROM accounts WHERE `".concat(column, "` = ?"), [id])];
        });
    });
}
function SelectDefaultAccountId(column, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.column("SELECT id FROM accounts WHERE `".concat(column, "` = ? AND isDefault = 1"), [id])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function SelectAccount(id) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = db_1.db).single;
                    return [4 /*yield*/, SelectAccounts('id', id)];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        });
    });
}
function IsAccountIdAvailable(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.exists(doesAccountExist, [id])];
                case 1: return [2 /*return*/, !(_a.sent())];
            }
        });
    });
}
function CreateNewAccount(owner, label, isDefault) {
    return __awaiter(this, void 0, void 0, function () {
        var env_3, conn, _a, accountId, column, result, e_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    env_3 = { stack: [], error: void 0, hasError: false };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, 6, 7]);
                    _a = [env_3];
                    return [4 /*yield*/, (0, db_1.GetConnection)()];
                case 2:
                    conn = __addDisposableResource.apply(void 0, _a.concat([_b.sent(), false]));
                    return [4 /*yield*/, GenerateAccountId(conn)];
                case 3:
                    accountId = _b.sent();
                    column = typeof owner === 'string' ? 'group' : 'owner';
                    return [4 /*yield*/, conn.update("INSERT INTO accounts (id, label, `".concat(column, "`, type, isDefault) VALUES (?, ?, ?, ?, ?)"), [accountId, label, owner, column === 'group' ? 'group' : 'personal', isDefault || 0])];
                case 4:
                    result = _b.sent();
                    if (result && column === 'owner')
                        conn.execute('INSERT INTO accounts_access (accountId, charId, role) VALUE (?, ?, ?)', [accountId, owner, 'owner']);
                    return [2 /*return*/, accountId];
                case 5:
                    e_4 = _b.sent();
                    env_3.error = e_4;
                    env_3.hasError = true;
                    return [3 /*break*/, 7];
                case 6:
                    __disposeResources(env_3);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function DeleteAccount(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update("UPDATE accounts SET `type` = 'inactive' WHERE id = ?", [accountId])];
                case 1:
                    success = _a.sent();
                    if (!success)
                        return [2 /*return*/, {
                                success: false,
                                message: 'something_went_wrong',
                            }];
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
var selectAccountRole = 'SELECT role FROM accounts_access WHERE accountId = ? AND charId = ?';
function SelectAccountRole(accountId, charId) {
    return db_1.db.column(selectAccountRole, [accountId, charId]);
}
function DepositMoney(playerId, accountId, amount, message, note) {
    return __awaiter(this, void 0, void 0, function () {
        var env_4, player, money, conn, _a, balance, role, affectedRows, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    env_4 = { stack: [], error: void 0, hasError: false };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 11]);
                    amount = Number.parseInt(String(amount));
                    if (isNaN(amount))
                        return [2 /*return*/, { success: false, message: 'amount_not_number' }];
                    if (amount <= 0)
                        return [2 /*return*/, { success: false, message: 'invalid_amount' }];
                    player = class_2.OxPlayer.get(playerId);
                    if (!(player === null || player === void 0 ? void 0 : player.charId))
                        return [2 /*return*/, {
                                success: false,
                                message: 'no_charid',
                            }];
                    money = exports.ox_inventory.GetItemCount(playerId, 'money');
                    if (amount > money)
                        return [2 /*return*/, { success: false, message: 'insufficient_funds' }];
                    _a = [env_4];
                    return [4 /*yield*/, (0, db_1.GetConnection)()];
                case 2:
                    conn = __addDisposableResource.apply(void 0, _a.concat([_b.sent(), false]));
                    return [4 /*yield*/, conn.scalar(getBalance, [accountId])];
                case 3:
                    balance = _b.sent();
                    if (balance === null)
                        return [2 /*return*/, { success: false, message: 'no_balance' }];
                    return [4 /*yield*/, conn.scalar(selectAccountRole, [accountId, player.charId])];
                case 4:
                    role = _b.sent();
                    return [4 /*yield*/, (0, roles_1.CanPerformAction)(player, accountId, role, 'deposit')];
                case 5:
                    if (!(_b.sent()))
                        return [2 /*return*/, { success: false, message: 'no_access' }];
                    return [4 /*yield*/, conn.beginTransaction()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, conn.update(addBalance, [amount, accountId])];
                case 7:
                    affectedRows = _b.sent();
                    if (!affectedRows || !exports.ox_inventory.RemoveItem(playerId, 'money', amount)) {
                        conn.rollback();
                        return [2 /*return*/, {
                                success: false,
                                message: 'something_went_wrong',
                            }];
                    }
                    return [4 /*yield*/, conn.execute(addTransaction, [
                            player.charId,
                            null,
                            accountId,
                            amount,
                            message !== null && message !== void 0 ? message : (0, locales_1.default)('deposit'),
                            note,
                            null,
                            balance + amount,
                        ])];
                case 8:
                    _b.sent();
                    emit('ox:depositedMoney', { playerId: playerId, accountId: accountId, amount: amount });
                    return [2 /*return*/, {
                            success: true,
                        }];
                case 9:
                    e_5 = _b.sent();
                    env_4.error = e_5;
                    env_4.hasError = true;
                    return [3 /*break*/, 11];
                case 10:
                    __disposeResources(env_4);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function WithdrawMoney(playerId, accountId, amount, message, note) {
    return __awaiter(this, void 0, void 0, function () {
        var env_5, player, conn, _a, role, balance, affectedRows, e_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    env_5 = { stack: [], error: void 0, hasError: false };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, 10, 11]);
                    amount = Number.parseInt(String(amount));
                    if (isNaN(amount))
                        return [2 /*return*/, { success: false, message: 'amount_not_number' }];
                    if (amount <= 0)
                        return [2 /*return*/, { success: false, message: 'invalid_amount' }];
                    player = class_2.OxPlayer.get(playerId);
                    if (!(player === null || player === void 0 ? void 0 : player.charId))
                        return [2 /*return*/, { success: false, message: 'no_charId' }];
                    _a = [env_5];
                    return [4 /*yield*/, (0, db_1.GetConnection)()];
                case 2:
                    conn = __addDisposableResource.apply(void 0, _a.concat([_b.sent(), false]));
                    return [4 /*yield*/, conn.scalar(selectAccountRole, [accountId, player.charId])];
                case 3:
                    role = _b.sent();
                    return [4 /*yield*/, (0, roles_1.CanPerformAction)(player, accountId, role, 'withdraw')];
                case 4:
                    if (!(_b.sent()))
                        return [2 /*return*/, { success: false, message: 'no_access' }];
                    return [4 /*yield*/, conn.scalar(getBalance, [accountId])];
                case 5:
                    balance = _b.sent();
                    if (balance === null)
                        return [2 /*return*/, { success: false, message: 'no_balance' }];
                    return [4 /*yield*/, conn.beginTransaction()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, conn.update(safeRemoveBalance, [amount, accountId, amount])];
                case 7:
                    affectedRows = _b.sent();
                    if (!affectedRows || !exports.ox_inventory.AddItem(playerId, 'money', amount)) {
                        conn.rollback();
                        return [2 /*return*/, {
                                success: false,
                                message: 'something_went_wrong',
                            }];
                    }
                    return [4 /*yield*/, conn.execute(addTransaction, [
                            player.charId,
                            accountId,
                            null,
                            amount,
                            message !== null && message !== void 0 ? message : (0, locales_1.default)('withdraw'),
                            note,
                            balance - amount,
                            null,
                        ])];
                case 8:
                    _b.sent();
                    emit('ox:withdrewMoney', { playerId: playerId, accountId: accountId, amount: amount });
                    return [2 /*return*/, { success: true }];
                case 9:
                    e_6 = _b.sent();
                    env_5.error = e_6;
                    env_5.hasError = true;
                    return [3 /*break*/, 11];
                case 10:
                    __disposeResources(env_5);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
function UpdateAccountAccess(accountId, id, role) {
    return __awaiter(this, void 0, void 0, function () {
        var success_1, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!role) return [3 /*break*/, 2];
                    return [4 /*yield*/, db_1.db.update('DELETE FROM accounts_access WHERE accountId = ? AND charId = ?', [accountId, id])];
                case 1:
                    success_1 = _a.sent();
                    if (!success_1)
                        return [2 /*return*/, { success: false, message: 'something_went_wrong' }];
                    return [2 /*return*/, { success: true }];
                case 2: return [4 /*yield*/, db_1.db.update('INSERT INTO accounts_access (accountId, charId, role) VALUE (?, ?, ?) ON DUPLICATE KEY UPDATE role = VALUES(role)', [accountId, id, role])];
                case 3:
                    success = _a.sent();
                    if (!success)
                        return [2 /*return*/, { success: false, message: 'something_went_wrong' }];
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
function UpdateInvoice(invoiceId, charId) {
    return __awaiter(this, void 0, void 0, function () {
        var player, invoice, account, hasPermission, updateReceiver, updateSender, invoiceUpdated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    player = class_2.OxPlayer.getFromCharId(charId);
                    if (!(player === null || player === void 0 ? void 0 : player.charId))
                        return [2 /*return*/, { success: false, message: 'no_charId' }];
                    return [4 /*yield*/, db_1.db.row('SELECT * FROM `accounts_invoices` WHERE `id` = ?', [invoiceId])];
                case 1:
                    invoice = _a.sent();
                    if (!invoice)
                        return [2 /*return*/, { success: false, message: 'no_invoice' }];
                    if (invoice.payerId)
                        return [2 /*return*/, { success: false, message: 'invoice_paid' }];
                    return [4 /*yield*/, class_1.OxAccount.get(invoice.toAccount)];
                case 2:
                    account = _a.sent();
                    return [4 /*yield*/, (account === null || account === void 0 ? void 0 : account.playerHasPermission(player.source, 'payInvoice'))];
                case 3:
                    hasPermission = _a.sent();
                    if (!hasPermission)
                        return [2 /*return*/, { success: false, message: 'no_permission' }];
                    return [4 /*yield*/, UpdateBalance(invoice.toAccount, invoice.amount, 'remove', false, (0, locales_1.default)('invoice_payment'), undefined, charId)];
                case 4:
                    updateReceiver = _a.sent();
                    if (!updateReceiver.success)
                        return [2 /*return*/, { success: false, message: 'no_balance' }];
                    return [4 /*yield*/, UpdateBalance(invoice.fromAccount, invoice.amount, 'add', false, (0, locales_1.default)('invoice_payment'), undefined, charId)];
                case 5:
                    updateSender = _a.sent();
                    if (!updateSender.success)
                        return [2 /*return*/, { success: false, message: 'no_balance' }];
                    return [4 /*yield*/, db_1.db.update('UPDATE `accounts_invoices` SET `payerId` = ?, `paidAt` = ? WHERE `id` = ?', [
                            player.charId,
                            new Date(),
                            invoiceId,
                        ])];
                case 6:
                    invoiceUpdated = _a.sent();
                    if (!invoiceUpdated)
                        return [2 /*return*/, {
                                success: false,
                                message: 'invoice_not_updated',
                            }];
                    invoice.payerId = charId;
                    emit('ox:invoicePaid', invoice);
                    return [2 /*return*/, {
                            success: true,
                        }];
            }
        });
    });
}
function CreateInvoice(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var player, account, hasPermission, targetAccount, success;
        var actorId = _b.actorId, fromAccount = _b.fromAccount, toAccount = _b.toAccount, amount = _b.amount, message = _b.message, dueDate = _b.dueDate;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (isNaN(amount))
                        return [2 /*return*/, { success: false, message: 'amount_not_number' }];
                    if (amount <= 0)
                        return [2 /*return*/, { success: false, message: 'invalid_amount' }];
                    if (!actorId) return [3 /*break*/, 3];
                    player = class_2.OxPlayer.getFromCharId(actorId);
                    if (!(player === null || player === void 0 ? void 0 : player.charId))
                        return [2 /*return*/, { success: false, message: 'no_charid' }];
                    return [4 /*yield*/, class_1.OxAccount.get(fromAccount)];
                case 1:
                    account = _c.sent();
                    return [4 /*yield*/, (account === null || account === void 0 ? void 0 : account.playerHasPermission(player.source, 'sendInvoice'))];
                case 2:
                    hasPermission = _c.sent();
                    if (!hasPermission)
                        return [2 /*return*/, { success: false, message: 'no_permission' }];
                    _c.label = 3;
                case 3: return [4 /*yield*/, class_1.OxAccount.get(toAccount)];
                case 4:
                    targetAccount = _c.sent();
                    if (!targetAccount)
                        return [2 /*return*/, { success: false, message: 'no_target_account' }];
                    return [4 /*yield*/, db_1.db.insert('INSERT INTO accounts_invoices (`actorId`, `fromAccount`, `toAccount`, `amount`, `message`, `dueDate`) VALUES (?, ?, ?, ?, ?, ?)', [actorId, fromAccount, toAccount, amount, message, dueDate])];
                case 5:
                    success = _c.sent();
                    if (!success)
                        return [2 /*return*/, { success: false, message: 'invoice_insert_error' }];
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
function DeleteInvoice(invoiceId) {
    return __awaiter(this, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update('DELETE FROM `accounts_invoices` WHERE `id` = ?', [invoiceId])];
                case 1:
                    success = _a.sent();
                    if (!success)
                        return [2 /*return*/, { success: false, message: 'invoice_delete_error' }];
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
function SetAccountType(accountId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update('UPDATE `accounts` SET `type` = ? WHERE `id` = ?', [type, accountId])];
                case 1:
                    success = _a.sent();
                    if (!success)
                        return [2 /*return*/, { success: false, message: 'update_account_error' }];
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
