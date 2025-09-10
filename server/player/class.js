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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.OxPlayer = void 0;
var classInterface_1 = require("classInterface");
var db_1 = require("./db");
var ox_lib_1 = require("@communityox/ox_lib");
var groups_1 = require("groups");
var npwd_1 = require("bridge/npwd");
var status_1 = require("./status");
var server_1 = require("@communityox/ox_lib/server");
var db_2 = require("groups/db");
var accounts_1 = require("accounts");
var common_1 = require("../../common");
var license_1 = require("./license");
var config_1 = require("config");
var locales_1 = require("../../common/locales");
var OxPlayer = /** @class */ (function (_super) {
    __extends(OxPlayer, _super);
    function OxPlayer(source) {
        var _this = _super.call(this) || this;
        _OxPlayer_instances.add(_this);
        _OxPlayer_characters.set(_this, void 0);
        _OxPlayer_metadata.set(_this, void 0);
        _OxPlayer_statuses.set(_this, void 0);
        _OxPlayer_groups.set(_this, void 0);
        _OxPlayer_licenses.set(_this, void 0);
        _this.source = source;
        __classPrivateFieldSet(_this, _OxPlayer_characters, [], "f");
        __classPrivateFieldSet(_this, _OxPlayer_metadata, {}, "f");
        __classPrivateFieldSet(_this, _OxPlayer_statuses, {}, "f");
        __classPrivateFieldSet(_this, _OxPlayer_groups, {}, "f");
        __classPrivateFieldSet(_this, _OxPlayer_licenses, {}, "f");
        return _this;
    }
    /** Get an instance of OxPlayer with the matching playerId. */
    OxPlayer.get = function (id) {
        return this.members[id];
    };
    /** Get an instance of OxPlayer with the matching userId. */
    OxPlayer.getFromUserId = function (id) {
        return this.keys.userId[id];
    };
    /** Get an instance of OxPlayer with the matching charId. */
    OxPlayer.getFromCharId = function (id) {
        return this.keys.charId[id];
    };
    OxPlayer.formatBanReason = function (ban) {
        var unbanTime = ban.unban_at ? new Date(ban.unban_at) : null;
        var timeRemainingMessage;
        if (unbanTime) {
            var timeRemaining = +unbanTime - Date.now();
            var hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            timeRemainingMessage = (0, locales_1.default)('ban_expires_in', hours, minutes, seconds);
        }
        else
            timeRemainingMessage = (0, locales_1.default)('ban_indefinite');
        return (0, locales_1.default)('ban_notice', new Date(ban.banned_at).toLocaleString(), ban.reason, timeRemainingMessage);
    };
    /** Compares player fields and metadata to a filter, returning the player if all values match. */
    OxPlayer.prototype.filter = function (criteria) {
        var groups = criteria.groups, filter = __rest(criteria, ["groups"]);
        if (groups && !this.getGroup(groups))
            return;
        for (var key in filter) {
            var value = filter[key];
            if (this[key] !== value && __classPrivateFieldGet(this, _OxPlayer_metadata, "f")[key] !== value)
                return;
        }
        return this;
    };
    /** Get an instance of OxPlayer with that matches the filter. */
    OxPlayer.getFromFilter = function (filter) {
        for (var id in this.members) {
            var player = this.members[id].filter(filter);
            if (player)
                return player;
        }
    };
    OxPlayer.getAll = function (filter, asArray) {
        if (asArray === void 0) { asArray = false; }
        if (!filter)
            return asArray ? Object.values(this.members) : this.members;
        var obj = {};
        for (var id in this.members) {
            var player = this.members[id].filter(filter);
            if (player)
                obj[id] = player;
        }
        return asArray ? Object.values(obj) : obj;
    };
    /** Saves all players to the database, and optionally kicks them from the server. */
    OxPlayer.saveAll = function (kickWithReason) {
        var parameters = [];
        for (var id in this.members) {
            var player = this.members[id];
            if (player.charId) {
                parameters.push(__classPrivateFieldGet(player, _OxPlayer_instances, "m", _OxPlayer_getSaveData).call(player));
            }
            if (kickWithReason) {
                delete player.charId;
                DropPlayer(player.source, kickWithReason);
            }
        }
        DEV: console.info("Saving ".concat(parameters.length, " players to the database."));
        if (parameters.length > 0) {
            (0, db_1.SaveCharacterData)(parameters, true);
            emit('ox:savedPlayers', parameters.length);
        }
    };
    /** Triggers an event on the player's client. */
    OxPlayer.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        emitNet.apply(void 0, __spreadArray([eventName, this.source], args, false));
    };
    OxPlayer.prototype.set = function (key, value, replicated) {
        __classPrivateFieldGet(this, _OxPlayer_metadata, "f")[key] = value;
        if (replicated)
            this.emit('ox:setPlayerData', key, value);
    };
    /** Gets a value stored in active character's metadata. */
    OxPlayer.prototype.get = function (key) {
        return __classPrivateFieldGet(this, _OxPlayer_metadata, "f")[key];
    };
    OxPlayer.prototype.payInvoice = function (invoiceId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.charId)
                            return [2 /*return*/];
                        return [4 /*yield*/, (0, accounts_1.PayAccountInvoice)(invoiceId, this.charId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OxPlayer.prototype.setActiveGroup = function (groupName, temp) {
        if (!this.charId || (groupName && !(groupName in __classPrivateFieldGet(this, _OxPlayer_groups, "f"))))
            return false;
        var currentActiveGroup = this.get('activeGroup');
        if (currentActiveGroup) {
            GlobalState["".concat(currentActiveGroup, ":activeCount")] -= 1;
            var group = (0, groups_1.GetGroup)(currentActiveGroup);
            group.activePlayers.delete(+this.source);
        }
        if (groupName) {
            GlobalState["".concat(groupName, ":activeCount")] += 1;
            var group = (0, groups_1.GetGroup)(groupName);
            group.activePlayers.add(+this.source);
        }
        (0, db_2.SetActiveGroup)(this.charId, temp ? undefined : groupName);
        this.set('activeGroup', groupName, true);
        emit('ox:setActiveGroup', this.source, groupName, currentActiveGroup);
        return true;
    };
    /** Sets the active character's grade in a group. If the grade is 0 they will be removed from the group. */
    OxPlayer.prototype.setGroup = function (groupName_1) {
        return __awaiter(this, arguments, void 0, function (groupName, grade, force) {
            var group, currentGrade, _a, relatedGroups;
            var _this = this;
            if (grade === void 0) { grade = 0; }
            if (force === void 0) { force = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.charId)
                            return [2 /*return*/, false];
                        group = (0, groups_1.GetGroup)(groupName);
                        if (!group)
                            return [2 /*return*/, console.warn("Failed to set OxPlayer<".concat(this.userId, "> ").concat(groupName, ":").concat(grade, " (invalid group)"))];
                        currentGrade = __classPrivateFieldGet(this, _OxPlayer_groups, "f")[groupName];
                        if (currentGrade === grade)
                            return [2 /*return*/];
                        if (!!grade) return [3 /*break*/, 3];
                        if (!currentGrade)
                            return [2 /*return*/];
                        _a = !force;
                        if (!_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, db_2.RemoveCharacterGroup)(this.charId, group.name)];
                    case 1:
                        _a = !(_b.sent());
                        _b.label = 2;
                    case 2:
                        if (_a)
                            return [2 /*return*/];
                        __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_removeGroup).call(this, group, currentGrade, true);
                        if (this.get('activeGroup') === groupName)
                            this.set('activeGroup', undefined, true);
                        return [3 /*break*/, 7];
                    case 3:
                        if (!group.grades[grade] && grade > 0)
                            return [2 /*return*/, console.warn("Failed to set OxPlayer<".concat(this.userId, "> ").concat(group.name, ":").concat(grade, " (invalid grade)"))];
                        if (!currentGrade) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, db_2.UpdateCharacterGroup)(this.charId, group.name, grade)];
                    case 4:
                        if (!(_b.sent()))
                            return [2 /*return*/];
                        __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_removeGroup).call(this, group, currentGrade, false);
                        __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_addGroup).call(this, group, grade);
                        return [3 /*break*/, 7];
                    case 5:
                        relatedGroups = group.type && (0, groups_1.GetGroupsByType)(group.type);
                        if (relatedGroups &&
                            relatedGroups.some(function (name) {
                                return name in __classPrivateFieldGet(_this, _OxPlayer_groups, "f");
                            }))
                            return [2 /*return*/, console.warn("Failed to set OxPlayer<".concat(this.userId, "> ").concat(group.name, ":").concat(grade, " (already has group of type '").concat(group.type, "')"))];
                        return [4 /*yield*/, (0, db_2.AddCharacterGroup)(this.charId, group.name, grade)];
                    case 6:
                        if (!(_b.sent()))
                            return [2 /*return*/];
                        __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_addGroup).call(this, group, grade);
                        _b.label = 7;
                    case 7:
                        emit('ox:setGroup', this.source, group.name, grade ? grade : null);
                        this.emit('ox:setGroup', group.name, grade ? grade : null);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    OxPlayer.prototype.getGroup = function (filter) {
        if (typeof filter === 'string') {
            return __classPrivateFieldGet(this, _OxPlayer_groups, "f")[filter];
        }
        if (Array.isArray(filter)) {
            for (var _i = 0, filter_1 = filter; _i < filter_1.length; _i++) {
                var name_1 = filter_1[_i];
                var grade = __classPrivateFieldGet(this, _OxPlayer_groups, "f")[name_1];
                if (grade)
                    return [name_1, grade];
            }
        }
        else if (typeof filter === 'object') {
            for (var _a = 0, _b = Object.entries(filter); _a < _b.length; _a++) {
                var _c = _b[_a], name_2 = _c[0], requiredGrade = _c[1];
                var grade = __classPrivateFieldGet(this, _OxPlayer_groups, "f")[name_2];
                if (grade && requiredGrade <= grade) {
                    return [name_2, grade];
                }
            }
        }
    };
    OxPlayer.prototype.getGroupByType = function (type) {
        return this.getGroup((0, groups_1.GetGroupsByType)(type));
    };
    OxPlayer.prototype.getGroups = function () {
        return __classPrivateFieldGet(this, _OxPlayer_groups, "f");
    };
    OxPlayer.prototype.hasPermission = function (permission) {
        var _a;
        var matchResult = permission.match(/^group\.([^.]+)\.(.*)/);
        var groupName = matchResult === null || matchResult === void 0 ? void 0 : matchResult[1];
        permission = (_a = matchResult === null || matchResult === void 0 ? void 0 : matchResult[2]) !== null && _a !== void 0 ? _a : permission;
        if (groupName) {
            var grade = __classPrivateFieldGet(this, _OxPlayer_groups, "f")[groupName];
            if (!grade)
                return false;
            var permissions = (0, common_1.GetGroupPermissions)(groupName);
            for (var g = grade; g > 0; g--) {
                var value = permissions[g] && permissions[g][permission];
                if (value !== undefined)
                    return value;
            }
        }
        return false;
    };
    /** Sets the value of a status. */
    OxPlayer.prototype.setStatus = function (statusName, value) {
        if (value === void 0) { value = status_1.Statuses[statusName].default; }
        if (status_1.Statuses[statusName] === undefined)
            return;
        var newValue = value < 0 ? 0 : value > 100 ? 100 : Number.parseFloat((value).toPrecision(8));
        __classPrivateFieldGet(this, _OxPlayer_statuses, "f")[statusName] = newValue;
        this.emit('ox:setPlayerStatus', statusName, newValue, true);
        return true;
    };
    /** Returns the current value of a status. */
    OxPlayer.prototype.getStatus = function (statusName) {
        return __classPrivateFieldGet(this, _OxPlayer_statuses, "f")[statusName];
    };
    /** Returns an object containing all status names and their values. */
    OxPlayer.prototype.getStatuses = function () {
        return __classPrivateFieldGet(this, _OxPlayer_statuses, "f");
    };
    /** Increases the status's value by the given amount. */
    OxPlayer.prototype.addStatus = function (statusName, value) {
        if (__classPrivateFieldGet(this, _OxPlayer_statuses, "f")[statusName] === undefined)
            return;
        var newValue = __classPrivateFieldGet(this, _OxPlayer_statuses, "f")[statusName] + value;
        newValue = newValue < 0 ? 0 : newValue > 100 ? 100 : Number.parseFloat((newValue).toPrecision(8));
        __classPrivateFieldGet(this, _OxPlayer_statuses, "f")[statusName] = newValue;
        this.emit('ox:setPlayerStatus', statusName, newValue);
        return true;
    };
    /** Reduces the status's value by the given amount. */
    OxPlayer.prototype.removeStatus = function (statusName, value) {
        if (__classPrivateFieldGet(this, _OxPlayer_statuses, "f")[statusName] === undefined)
            return;
        var newValue = __classPrivateFieldGet(this, _OxPlayer_statuses, "f")[statusName] - value;
        newValue = newValue < 0 ? 0 : newValue > 100 ? 100 : Number.parseFloat((newValue).toPrecision(8));
        __classPrivateFieldGet(this, _OxPlayer_statuses, "f")[statusName] = newValue;
        this.emit('ox:setPlayerStatus', statusName, newValue);
        return true;
    };
    OxPlayer.prototype.getLicense = function (licenseName) {
        return __classPrivateFieldGet(this, _OxPlayer_licenses, "f")[licenseName];
    };
    OxPlayer.prototype.getLicenses = function () {
        return __classPrivateFieldGet(this, _OxPlayer_licenses, "f");
    };
    OxPlayer.prototype.addLicense = function (licenseName) {
        return __awaiter(this, void 0, void 0, function () {
            var license;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.charId || __classPrivateFieldGet(this, _OxPlayer_licenses, "f")[licenseName] || !license_1.Licenses[licenseName])
                            return [2 /*return*/, false];
                        license = {
                            issued: Date.now(),
                        };
                        return [4 /*yield*/, (0, db_1.AddCharacterLicense)(this.charId, licenseName, license)];
                    case 1:
                        if (!(_a.sent()))
                            return [2 /*return*/, false];
                        __classPrivateFieldGet(this, _OxPlayer_licenses, "f")[licenseName] = license;
                        emit('ox:licenseAdded', this.source, licenseName);
                        this.emit('ox:licenseAdded', licenseName);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    OxPlayer.prototype.removeLicense = function (licenseName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = !this.charId;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, db_1.RemoveCharacterLicense)(this.charId, licenseName)];
                    case 1:
                        _a = !(_b.sent());
                        _b.label = 2;
                    case 2:
                        if (_a)
                            return [2 /*return*/, false];
                        delete __classPrivateFieldGet(this, _OxPlayer_licenses, "f")[licenseName];
                        emit('ox:licenseRemoved', this.source, licenseName);
                        this.emit('ox:licenseRemoved', licenseName);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    OxPlayer.prototype.updateLicense = function (licenseName, key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var license;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.charId)
                            return [2 /*return*/, false];
                        license = __classPrivateFieldGet(this, _OxPlayer_licenses, "f")[licenseName];
                        if (!license || key === 'issued')
                            return [2 /*return*/, false];
                        return [4 /*yield*/, (0, db_1.UpdateCharacterLicense)(this.charId, licenseName, key, value)];
                    case 1:
                        if (!(_a.sent()))
                            return [2 /*return*/, false];
                        value == null ? delete license[key] : (license[key] = value);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /** Saves the active character to the database. */
    OxPlayer.prototype.save = function () {
        if (this.charId)
            return (0, db_1.SaveCharacterData)(__classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_getSaveData).call(this));
    };
    /** Adds the player to the player registry and starts character selection. */
    OxPlayer.prototype.setAsJoined = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!OxPlayer.getFromUserId(this.userId)) {
                            OxPlayer.add(this.source, this);
                            Player(this.source).state.set('userId', this.userId, true);
                        }
                        DEV: console.info("Starting character selection for OxPlayer<".concat(this.userId, ">"));
                        _a = this.emit;
                        _b = ['ox:startCharacterSelect', this.userId];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_getCharacters).call(this)];
                    case 1:
                        _a.apply(this, _b.concat([_c.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Clears data for the active character. If the player is still connected then transition them to character selection.
     * @param dropped If the player has been dropped from the server.
     * @param save If character data should be saved to the database (defaults to true).
     */
    OxPlayer.prototype.logout = function () {
        return __awaiter(this, arguments, void 0, function (save, dropped) {
            var name_3, _a, _b;
            if (save === void 0) { save = true; }
            if (dropped === void 0) { dropped = false; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.charId)
                            return [2 /*return*/];
                        for (name_3 in __classPrivateFieldGet(this, _OxPlayer_groups, "f"))
                            __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_removeGroup).call(this, name_3, __classPrivateFieldGet(this, _OxPlayer_groups, "f")[name_3], true);
                        emit('ox:playerLogout', this.source, this.userId, this.charId);
                        if (!save) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.save()];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        if (dropped)
                            return [2 /*return*/];
                        delete OxPlayer.keys.charId[this.charId];
                        delete this.charId;
                        _a = this.emit;
                        _b = ['ox:startCharacterSelect', this.userId];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_getCharacters).call(this)];
                    case 3:
                        _a.apply(this, _b.concat([_c.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Registers a new character for the player. */
    OxPlayer.prototype.createCharacter = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var stateId, phoneNumber, character;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.charId || __classPrivateFieldGet(this, _OxPlayer_characters, "f").length >= config_1.CHARACTER_SLOTS)
                            return [2 /*return*/];
                        return [4 /*yield*/, __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_generateStateId).call(this)];
                    case 1:
                        stateId = _b.sent();
                        return [4 /*yield*/, (0, npwd_1.GeneratePhoneNumber)()];
                    case 2:
                        phoneNumber = _b.sent();
                        _a = {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            stateId: stateId
                        };
                        return [4 /*yield*/, (0, db_1.CreateCharacter)(this.userId, stateId, data.firstName, data.lastName, data.gender, data.date, phoneNumber)];
                    case 3:
                        character = (_a.charId = _b.sent(),
                            _a.isNew = true,
                            _a.gender = data.gender,
                            _a);
                        __classPrivateFieldGet(this, _OxPlayer_characters, "f").push(character);
                        emit('ox:createdCharacter', this.source, this.userId, character.charId);
                        return [2 /*return*/, __classPrivateFieldGet(this, _OxPlayer_characters, "f").length - 1];
                }
            });
        });
    };
    /** Loads and sets the player's active character. */
    OxPlayer.prototype.setActiveCharacter = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var characterSlot, _a, character, metadata, statuses, isDead, gender, dateOfBirth, phoneNumber, health, armour, groups, licenses, activeGroup, name_4, group, state;
            var _this = this;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.charId)
                            return [2 /*return*/];
                        if (!(typeof data === 'object')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createCharacter(data)];
                    case 1:
                        _a = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_getCharacterSlotFromId).call(this, data);
                        _c.label = 3;
                    case 3:
                        characterSlot = _a;
                        if (characterSlot == null)
                            return [2 /*return*/];
                        character = __classPrivateFieldGet(this, _OxPlayer_characters, "f")[characterSlot];
                        __classPrivateFieldGet(this, _OxPlayer_characters, "f").length = 0;
                        this.charId = character.charId;
                        this.stateId = character.stateId;
                        this.ped = GetPlayerPed(this.source);
                        return [4 /*yield*/, (0, db_1.GetCharacterMetadata)(character.charId)];
                    case 4:
                        metadata = _c.sent();
                        if (!metadata)
                            return [2 /*return*/];
                        statuses = metadata.statuses || __classPrivateFieldGet(this, _OxPlayer_statuses, "f");
                        isDead = metadata.isDead, gender = metadata.gender, dateOfBirth = metadata.dateOfBirth, phoneNumber = metadata.phoneNumber, health = metadata.health, armour = metadata.armour;
                        return [4 /*yield*/, (0, db_2.GetCharacterGroups)(this.charId)];
                    case 5:
                        groups = _c.sent();
                        return [4 /*yield*/, (0, db_1.GetCharacterLicenses)(this.charId)];
                    case 6:
                        licenses = _c.sent();
                        activeGroup = (_b = groups.find(function (group) { return group.isActive; })) === null || _b === void 0 ? void 0 : _b.name;
                        character.health = isDead ? 0 : health;
                        character.armour = armour;
                        groups.forEach(function (_a) {
                            var name = _a.name, grade = _a.grade;
                            return __classPrivateFieldGet(_this, _OxPlayer_instances, "m", _OxPlayer_addGroup).call(_this, name, grade);
                        });
                        licenses.forEach(function (_a) {
                            var name = _a.name, data = _a.data;
                            return (__classPrivateFieldGet(_this, _OxPlayer_licenses, "f")[name] = data);
                        });
                        for (name_4 in status_1.Statuses)
                            this.setStatus(name_4, statuses[name_4]);
                        this.emit('ox:setActiveCharacter', character, __classPrivateFieldGet(this, _OxPlayer_groups, "f"));
                        // Values stored in metadata and synced to client.
                        this.set('name', "".concat(character.firstName, " ").concat(character.lastName), true);
                        this.set('firstName', character.firstName, true);
                        this.set('lastName', character.lastName, true);
                        this.set('gender', gender, true);
                        this.set('dateOfBirth', dateOfBirth, true);
                        this.set('phoneNumber', phoneNumber, true);
                        this.set('activeGroup', activeGroup, true);
                        if (activeGroup) {
                            GlobalState["".concat(activeGroup, ":activeCount")] += 1;
                            group = (0, groups_1.GetGroup)(activeGroup);
                            group.activePlayers.add(+this.source);
                        }
                        DEV: console.info("Restored OxPlayer<".concat(this.userId, "> previous active group: ").concat(activeGroup));
                        OxPlayer.keys.charId[character.charId] = this;
                        state = Player(this.source).state;
                        state.set('isDead', isDead === 1, true);
                        DEV: console.info("OxPlayer<".concat(this.userId, "> loaded character ").concat(this.get('name'), " (").concat(this.charId, ")"));
                        emit('ox:playerLoaded', this.source, this.userId, character.charId);
                        return [2 /*return*/, character];
                }
            });
        });
    };
    /** Deletes a character with the given charId if it's owned by the player. */
    OxPlayer.prototype.deleteCharacter = function (charId) {
        return __awaiter(this, void 0, void 0, function () {
            var isActive, characterSlot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isActive = this.charId === charId;
                        if (this.charId && !isActive)
                            return [2 /*return*/];
                        characterSlot = isActive ? 0 : __classPrivateFieldGet(this, _OxPlayer_instances, "m", _OxPlayer_getCharacterSlotFromId).call(this, charId);
                        if (characterSlot === -1)
                            return [2 /*return*/];
                        return [4 /*yield*/, (0, db_1.DeleteCharacter)(charId)];
                    case 1:
                        if (_a.sent()) {
                            if (isActive)
                                this.logout(false);
                            else
                                __classPrivateFieldGet(this, _OxPlayer_characters, "f").splice(characterSlot, 1);
                            emit('ox:deletedCharacter', this.source, this.userId, charId);
                            DEV: console.info("Deleted character ".concat(charId, " for OxPlayer<").concat(this.userId, ">"));
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    var _OxPlayer_instances, _OxPlayer_characters, _OxPlayer_metadata, _OxPlayer_statuses, _OxPlayer_groups, _OxPlayer_licenses, _OxPlayer_getSaveData, _OxPlayer_addGroup, _OxPlayer_removeGroup, _OxPlayer_getCharacters, _OxPlayer_generateStateId, _OxPlayer_getCharacterSlotFromId;
    _OxPlayer_characters = new WeakMap(), _OxPlayer_metadata = new WeakMap(), _OxPlayer_statuses = new WeakMap(), _OxPlayer_groups = new WeakMap(), _OxPlayer_licenses = new WeakMap(), _OxPlayer_instances = new WeakSet(), _OxPlayer_getSaveData = function _OxPlayer_getSaveData() {
        return __spreadArray(__spreadArray([], GetEntityCoords(this.ped), true), [
            GetEntityHeading(this.ped),
            Player(this.source).state.isDead || false,
            GetEntityHealth(this.ped),
            GetPedArmour(this.ped),
            JSON.stringify(__classPrivateFieldGet(this, _OxPlayer_statuses, "f") || {}),
            this.charId,
        ], false);
    }, _OxPlayer_addGroup = function _OxPlayer_addGroup(group, grade) {
        var groupName = typeof group === 'string' ? group : group.name;
        group = (0, groups_1.GetGroup)(groupName);
        if (!group)
            return console.warn("Failed to add group '".concat(groupName, "' to OxPlayer<").concat(this.userId, "> (invalid group)"));
        (0, server_1.addPrincipal)(this.source, "".concat(group.principal, ":").concat(grade));
        DEV: console.info("Added OxPlayer<".concat(this.userId, "> to group '").concat(group.name, "' as grade ").concat(grade, "."));
        __classPrivateFieldGet(this, _OxPlayer_groups, "f")[group.name] = grade;
        GlobalState["".concat(group.name, ":count")] += 1;
    }, _OxPlayer_removeGroup = function _OxPlayer_removeGroup(group, grade, canRemoveActiveCount) {
        if (canRemoveActiveCount === void 0) { canRemoveActiveCount = false; }
        var groupName = typeof group === 'string' ? group : group.name;
        group = (0, groups_1.GetGroup)(groupName);
        if (!group)
            return console.warn("Failed to remove group '".concat(groupName, "' from OxPlayer<").concat(this.userId, "> (invalid group)"));
        (0, server_1.removePrincipal)(this.source, "".concat(group.principal, ":").concat(grade));
        DEV: console.info("Removed OxPlayer<".concat(this.userId, "> from group '").concat(group.name, "'."));
        delete __classPrivateFieldGet(this, _OxPlayer_groups, "f")[group.name];
        GlobalState["".concat(group.name, ":count")] -= 1;
        if (canRemoveActiveCount && group.name === this.get('activeGroup')) {
            GlobalState["".concat(group.name, ":activeCount")] -= 1;
            group.activePlayers.delete(+this.source);
        }
    }, _OxPlayer_getCharacters = function _OxPlayer_getCharacters() {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = [this, _OxPlayer_characters];
                        return [4 /*yield*/, (0, db_1.GetCharacters)(this.userId)];
                    case 1:
                        __classPrivateFieldSet.apply(void 0, _a.concat([_b.sent(), "f"]));
                        return [2 /*return*/, __classPrivateFieldGet(this, _OxPlayer_characters, "f")];
                }
            });
        });
    }, _OxPlayer_generateStateId = function _OxPlayer_generateStateId() {
        return __awaiter(this, void 0, void 0, function () {
            var arr, i, i, stateId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        arr = [];
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        for (i = 0; i < 2; i++)
                            arr[i] = (0, ox_lib_1.getRandomChar)();
                        for (i = 2; i < 6; i++)
                            arr[i] = (0, ox_lib_1.getRandomInt)();
                        stateId = arr.join('');
                        return [4 /*yield*/, (0, db_1.IsStateIdAvailable)(stateId)];
                    case 2:
                        if (_a.sent())
                            return [2 /*return*/, stateId];
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, _OxPlayer_getCharacterSlotFromId = function _OxPlayer_getCharacterSlotFromId(charId) {
        if (this.charId)
            return -1;
        return __classPrivateFieldGet(this, _OxPlayer_characters, "f").findIndex(function (character) {
            return character.charId === charId;
        });
    };
    OxPlayer.members = {};
    OxPlayer.keys = {
        userId: {},
        charId: {},
    };
    return OxPlayer;
}(classInterface_1.ClassInterface));
exports.OxPlayer = OxPlayer;
OxPlayer.init();
exports('SaveAllPlayers', function (arg) { return OxPlayer.saveAll(arg); });
exports('GetPlayerFromUserId', function (arg) { return OxPlayer.getFromUserId(arg); });
exports('GetPlayerFromCharId', function (arg) { return OxPlayer.getFromCharId(arg); });
exports('GetPlayerFromFilter', function (arg) { return OxPlayer.getFromFilter(arg); });
exports('GetPlayers', function (arg) { return OxPlayer.getAll(arg, true); });
