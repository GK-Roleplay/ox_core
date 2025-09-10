"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroup = GetGroup;
exports.GetGroupsByType = GetGroupsByType;
exports.GetGroupActivePlayers = GetGroupActivePlayers;
exports.GetGroupActivePlayersByType = GetGroupActivePlayersByType;
exports.SetGroupPermission = SetGroupPermission;
exports.RemoveGroupPermission = RemoveGroupPermission;
exports.CreateGroup = CreateGroup;
exports.DeleteGroup = DeleteGroup;
var server_1 = require("@communityox/ox_lib/server");
var db_1 = require("./db");
var class_1 = require("player/class");
var common_1 = require("../../common");
var accounts_1 = require("accounts");
var db_2 = require("accounts/db");
var groups = {};
GlobalState.groups = [];
function GetGroup(name) {
    return groups[name];
}
function GetGroupsByType(type) {
    return Object.values(groups).reduce(function (acc, group) {
        if (group.type === type)
            acc.push(group.name);
        return acc;
    }, []);
}
function GetGroupActivePlayers(groupName) {
    var group = groups[groupName];
    return group ? __spreadArray([], group.activePlayers, true) : [];
}
function GetGroupActivePlayersByType(type) {
    return Object.values(groups).reduce(function (acc, group) {
        if (group.type === type) {
            acc.push.apply(acc, group.activePlayers);
        }
        return acc;
    }, []);
}
function SetGroupPermission(groupName, grade, permission, value) {
    var permissions = (0, common_1.GetGroupPermissions)(groupName);
    if (!permissions[grade])
        permissions[grade] = {};
    permissions[grade][permission] = value === 'allow' ? true : false;
    GlobalState["group.".concat(groupName, ":permissions")] = permissions;
}
function RemoveGroupPermission(groupName, grade, permission) {
    var permissions = (0, common_1.GetGroupPermissions)(groupName);
    if (!permissions[grade])
        return;
    delete permissions[grade][permission];
    GlobalState["group.".concat(groupName, ":permissions")] = permissions;
}
function SetupGroup(data) {
    var group = __assign(__assign({}, data), { principal: "group.".concat(data.name), hasAccount: Boolean(data.hasAccount) });
    GlobalState[group.principal] = group;
    GlobalState["".concat(group.name, ":count")] = 0;
    GlobalState["".concat(group.name, ":activeCount")] = 0;
    group.activePlayers = new Set();
    groups[group.name] = group;
    group.grades = group.grades.reduce(function (acc, value, index) {
        acc[index + 1] = value;
        return acc;
    }, {});
    var parent = group.principal;
    for (var i in group.grades) {
        var child = "".concat(group.principal, ":").concat(i);
        if (!IsPrincipalAceAllowed(child, child)) {
            (0, server_1.addAce)(child, child, true);
            (0, server_1.addPrincipal)(child, parent);
        }
        parent = child;
    }
    if (group.hasAccount) {
        (0, accounts_1.GetGroupAccount)(group.name).then(function (account) {
            if (!account)
                (0, db_2.CreateNewAccount)(group.name, group.label, true);
        });
    }
    DEV: console.info("Instantiated OxGroup<".concat(group.name, ">"));
    return group;
}
// @todo more data validation and error handling
function CreateGroup(data) {
    return __awaiter(this, void 0, void 0, function () {
        var grades, accountRoles, group, response;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (groups[data.name])
                        throw new Error("Cannot create OxGroup<".concat(data.name, "> (group already exists with that name)"));
                    grades = data.grades.map(function (grade) { return grade.label; });
                    accountRoles = data.grades.reduce(function (acc, grade, index) {
                        if (grade.accountRole)
                            acc[index + 1] = grade.accountRole;
                        return acc;
                    }, {});
                    group = __assign(__assign({}, data), { grades: grades, accountRoles: accountRoles, hasAccount: (_a = data.hasAccount) !== null && _a !== void 0 ? _a : false, activePlayers: new Set() });
                    return [4 /*yield*/, (0, db_1.InsertGroup)(group)];
                case 1:
                    response = _b.sent();
                    if (response) {
                        SetupGroup(group);
                        GlobalState.groups = __spreadArray(__spreadArray([], GlobalState.groups, true), [data.name], false);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function DeleteGroup(groupName) {
    return __awaiter(this, void 0, void 0, function () {
        var deleted, group, parent, i, child, players, id, player;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.RemoveGroup)(groupName)];
                case 1:
                    deleted = _a.sent();
                    group = deleted && groups[groupName];
                    if (!group)
                        throw new Error("Cannot delete OxGroup<".concat(groupName, "> (no group exists with that name)"));
                    parent = group.principal;
                    (0, server_1.removeAce)(parent, parent, true);
                    for (i in group.grades) {
                        child = "".concat(group.principal, ":").concat(i);
                        (0, server_1.removeAce)(child, child, true);
                        (0, server_1.removePrincipal)(child, parent);
                        parent = child;
                    }
                    players = class_1.OxPlayer.getAll({
                        groups: groupName,
                    });
                    for (id in players) {
                        player = players[id];
                        player.setGroup(groupName, 0, true);
                    }
                    GlobalState[group.principal] = null;
                    GlobalState["".concat(group.name, ":count")] = null;
                    GlobalState["".concat(group.name, ":activeCount")] = null;
                    GlobalState.groups = GlobalState.groups.filter(function (name) { return name !== groupName; });
                    delete groups[group.name];
                    return [2 /*return*/];
            }
        });
    });
}
function LoadGroups() {
    return __awaiter(this, void 0, void 0, function () {
        var dbGroups;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.SelectGroups)()];
                case 1:
                    dbGroups = _a.sent();
                    GlobalState.groups = dbGroups.map(function (group) { return SetupGroup(group).name; });
                    return [2 /*return*/];
            }
        });
    });
}
setImmediate(LoadGroups);
(0, server_1.addCommand)('reloadgroups', LoadGroups, {
    help: 'Reload groups from the database.',
    restricted: 'group.admin',
});
(0, server_1.addCommand)('setgroup', function (playerId, args, raw) { return __awaiter(void 0, void 0, void 0, function () {
    var player;
    return __generator(this, function (_a) {
        player = class_1.OxPlayer.get(args.target);
        player === null || player === void 0 ? void 0 : player.setGroup(args.group, args.grade || 0);
        return [2 /*return*/];
    });
}); }, {
    help: "Update a player's grade for a group.",
    restricted: 'group.admin',
    params: [
        { name: 'target', paramType: 'playerId' },
        { name: 'group', paramType: 'string' },
        {
            name: 'grade',
            paramType: 'number',
            help: 'The new grade to set. Set to 0 or omit to remove the group.',
            optional: true,
        },
    ],
});
exports('GetGroupsByType', GetGroupsByType);
exports('SetGroupPermission', SetGroupPermission);
exports('RemoveGroupPermission', RemoveGroupPermission);
exports('CreateGroup', CreateGroup);
exports('DeleteGroup', DeleteGroup);
exports('GetGroupActivePlayers', GetGroupActivePlayers);
exports('GetGroupActivePlayersByType', GetGroupActivePlayersByType);
