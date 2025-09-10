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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCharacterAccount = GetCharacterAccount;
exports.GetGroupAccount = GetGroupAccount;
exports.CreateAccount = CreateAccount;
exports.PayAccountInvoice = PayAccountInvoice;
exports.DeleteAccountInvoice = DeleteAccountInvoice;
var db_1 = require("./db");
var db_2 = require("player/db");
var class_1 = require("./class");
setInterval(function () {
    var accounts = class_1.OxAccount.getAll();
    for (var accountId in accounts) {
        var account = accounts[accountId];
        class_1.OxAccount.remove(account.accountId);
    }
}, 60000);
/**
 * Return the default account for a character.
 * @param id The charId or stateId used to identify the character.
 */
function GetCharacterAccount(id) {
    return __awaiter(this, void 0, void 0, function () {
        var charId, _a, accountId, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(typeof id === 'string')) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, db_2.GetCharIdFromStateId)(id)];
                case 1:
                    _a = _c.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = id;
                    _c.label = 3;
                case 3:
                    charId = _a;
                    _b = charId;
                    if (!_b) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, db_1.SelectDefaultAccountId)('owner', charId)];
                case 4:
                    _b = (_c.sent());
                    _c.label = 5;
                case 5:
                    accountId = _b;
                    return [2 /*return*/, accountId ? class_1.OxAccount.get(accountId) : null];
            }
        });
    });
}
/**
 * Return the default account for a group.
 */
function GetGroupAccount(groupName) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.SelectDefaultAccountId)('group', groupName)];
                case 1:
                    accountId = _a.sent();
                    return [2 /*return*/, accountId ? class_1.OxAccount.get(accountId) : null];
            }
        });
    });
}
function CreateAccount(owner, label) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.CreateNewAccount)(owner, label)];
                case 1:
                    accountId = _a.sent();
                    return [2 /*return*/, class_1.OxAccount.get(accountId)];
            }
        });
    });
}
function PayAccountInvoice(invoiceId, charId) {
    return (0, db_1.UpdateInvoice)(invoiceId, charId);
}
function DeleteAccountInvoice(invoiceId) {
    return (0, db_1.DeleteInvoice)(invoiceId);
}
exports('GetCharacterAccount', GetCharacterAccount);
exports('GetGroupAccount', GetGroupAccount);
exports('CreateAccount', CreateAccount);
exports('PayAccountInvoice', PayAccountInvoice);
exports('DeleteAccountInvoice', DeleteAccountInvoice);
