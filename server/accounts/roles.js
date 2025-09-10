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
exports.CheckRolePermission = CheckRolePermission;
exports.CanPerformAction = CanPerformAction;
var db_1 = require("db");
var db_2 = require("./db");
var groups_1 = require("groups");
var accountRoles = {};
var blacklistedGroupActions = {
    addUser: true,
    removeUser: true,
    manageUser: true,
    transferOwnership: true,
    manageAccount: true,
    closeAccount: true,
};
function CheckRolePermission(roleName, permission) {
    var _a;
    if (!roleName)
        return;
    return (_a = accountRoles === null || accountRoles === void 0 ? void 0 : accountRoles[roleName.toLowerCase()]) === null || _a === void 0 ? void 0 : _a[permission];
}
function CanPerformAction(player, accountId, role, action) {
    return __awaiter(this, void 0, void 0, function () {
        var groupName, group, groupRole;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (CheckRolePermission(role, action))
                        return [2 /*return*/, true];
                    return [4 /*yield*/, (0, db_2.SelectAccount)(accountId)];
                case 1:
                    groupName = (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.group;
                    if (groupName) {
                        if (action in blacklistedGroupActions)
                            return [2 /*return*/, false];
                        group = (0, groups_1.GetGroup)(groupName);
                        groupRole = group.accountRoles[player.getGroup(groupName)];
                        if (CheckRolePermission(groupRole, action))
                            return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
function LoadRoles() {
    return __awaiter(this, void 0, void 0, function () {
        var roles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.execute('SELECT * FROM account_roles')];
                case 1:
                    roles = _a.sent();
                    if (!roles[0])
                        return [2 /*return*/];
                    roles.forEach(function (role) {
                        var roleName = role.name.toLowerCase();
                        delete role.name;
                        delete role.id;
                        accountRoles[roleName] = role;
                        GlobalState["accountRole.".concat(roleName)] = role;
                    });
                    GlobalState['accountRoles'] = Object.keys(accountRoles);
                    return [2 /*return*/];
            }
        });
    });
}
setImmediate(LoadRoles);
