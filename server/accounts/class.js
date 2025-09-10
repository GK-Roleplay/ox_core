"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxAccount = void 0;
var classInterface_1 = require("classInterface");
var class_1 = require("player/class");
var db_1 = require("player/db");
var db_2 = require("./db");
var roles_1 = require("./roles");
var OxAccount = /** @class */ (function (_super) {
    __extends(OxAccount, _super);
    function OxAccount(accountId) {
        var _this = _super.call(this) || this;
        _this.accountId = accountId;
        OxAccount.add(accountId, _this);
        return _this;
    }
    OxAccount.get = function (accountId) {
        return __awaiter(this, void 0, void 0, function () {
            var validAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (accountId in this.members)
                            this.members[accountId];
                        return [4 /*yield*/, (0, db_2.SelectAccount)(accountId)];
                    case 1:
                        validAccount = _a.sent();
                        if (!validAccount)
                            throw new Error("No account exists with accountId ".concat(accountId, "."));
                        return [2 /*return*/, new OxAccount(accountId)];
                }
            });
        });
    };
    OxAccount.getAll = function () {
        return this.members;
    };
    OxAccount.prototype.get = function (keys) {
        return __awaiter(this, void 0, void 0, function () {
            var metadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, db_2.SelectAccount)(this.accountId)];
                    case 1:
                        metadata = _a.sent();
                        if (!metadata)
                            return [2 /*return*/, null];
                        if (Array.isArray(keys))
                            return [2 /*return*/, keys.reduce(function (acc, key) {
                                    acc[key] = metadata[key];
                                    return acc;
                                }, {})];
                        return [2 /*return*/, metadata[keys]];
                }
            });
        });
    };
    /**
     * Add funds to the account.
     */
    OxAccount.prototype.addBalance = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var amount = _b.amount, message = _b.message;
            return __generator(this, function (_c) {
                return [2 /*return*/, (0, db_2.UpdateBalance)(this.accountId, amount, 'add', false, message)];
            });
        });
    };
    /**
     * Remove funds from the account.
     */
    OxAccount.prototype.removeBalance = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var amount = _b.amount, _c = _b.overdraw, overdraw = _c === void 0 ? false : _c, message = _b.message;
            return __generator(this, function (_d) {
                return [2 /*return*/, (0, db_2.UpdateBalance)(this.accountId, amount, 'remove', overdraw, message)];
            });
        });
    };
    /**
     * Transfer funds to another account.
     */
    OxAccount.prototype.transferBalance = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var toId = _b.toId, amount = _b.amount, _c = _b.overdraw, overdraw = _c === void 0 ? false : _c, message = _b.message, note = _b.note, actorId = _b.actorId;
            return __generator(this, function (_d) {
                return [2 /*return*/, (0, db_2.PerformTransaction)(this.accountId, toId, amount, overdraw, message, note, actorId)];
            });
        });
    };
    /**
     * Deposit money into the account.
     */
    OxAccount.prototype.depositMoney = function (playerId, amount, message, note) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, db_2.DepositMoney)(playerId, this.accountId, amount, message, note)];
            });
        });
    };
    /**
     * Withdraw money from the account.
     */
    OxAccount.prototype.withdrawMoney = function (playerId, amount, message, note) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, db_2.WithdrawMoney)(playerId, this.accountId, amount, message, note)];
            });
        });
    };
    /**
     * Mark the account as deleted. It can no longer be accessed, but remains in the database.
     */
    OxAccount.prototype.deleteAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, db_2.DeleteAccount)(this.accountId)];
            });
        });
    };
    /**
     * Get the account access role of a character by charId or stateId.
     */
    OxAccount.prototype.getCharacterRole = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var charId, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof id === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, db_1.GetCharIdFromStateId)(id)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = id;
                        _b.label = 3;
                    case 3:
                        charId = _a;
                        return [2 /*return*/, charId ? (0, db_2.SelectAccountRole)(this.accountId, charId) : null];
                }
            });
        });
    };
    /**
     * Set the account access role of a character by charId or stateId.
     */
    OxAccount.prototype.setCharacterRole = function (id, role) {
        return __awaiter(this, void 0, void 0, function () {
            var charId, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof id === 'string')) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, db_1.GetCharIdFromStateId)(id)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = id;
                        _b.label = 3;
                    case 3:
                        charId = _a;
                        return [2 /*return*/, charId && (0, db_2.UpdateAccountAccess)(this.accountId, charId, role)];
                }
            });
        });
    };
    /**
     * Checks if a player's active character has permission to perform an action on the account.
     */
    OxAccount.prototype.playerHasPermission = function (playerId, permission) {
        return __awaiter(this, void 0, void 0, function () {
            var player, role;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = class_1.OxPlayer.get(playerId);
                        if (!(player === null || player === void 0 ? void 0 : player.charId))
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.getCharacterRole(player.charId)];
                    case 1:
                        role = _a.sent();
                        return [4 /*yield*/, (0, roles_1.CanPerformAction)(player, this.accountId, role, permission)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Set the account as shared, allowing permissions to be assigned to other characters.
     */
    OxAccount.prototype.setShared = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (0, db_2.SetAccountType)(this.accountId, 'shared')];
            });
        });
    };
    /**
     * Create an unpaid invoice on the account.
     */
    OxAccount.prototype.createInvoice = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invoice = __assign({ fromAccount: this.accountId }, data);
                        return [4 /*yield*/, (0, db_2.CreateInvoice)(invoice)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OxAccount.members = {};
    return OxAccount;
}(classInterface_1.ClassInterface));
exports.OxAccount = OxAccount;
OxAccount.init();
