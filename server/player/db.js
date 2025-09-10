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
exports.GetUserIdFromIdentifier = GetUserIdFromIdentifier;
exports.CreateUser = CreateUser;
exports.GetUserAuthByUsername = GetUserAuthByUsername;
exports.GetUsernameByUserId = GetUsernameByUserId;
exports.IsStateIdAvailable = IsStateIdAvailable;
exports.CreateCharacter = CreateCharacter;
exports.GetCharacters = GetCharacters;
exports.SaveCharacterData = SaveCharacterData;
exports.DeleteCharacter = DeleteCharacter;
exports.GetCharacterMetadata = GetCharacterMetadata;
exports.GetStatuses = GetStatuses;
exports.GetLicenses = GetLicenses;
exports.GetLicense = GetLicense;
exports.GetCharacterLicenses = GetCharacterLicenses;
exports.AddCharacterLicense = AddCharacterLicense;
exports.RemoveCharacterLicense = RemoveCharacterLicense;
exports.UpdateCharacterLicense = UpdateCharacterLicense;
exports.GetCharIdFromStateId = GetCharIdFromStateId;
exports.UpdateUserTokens = UpdateUserTokens;
exports.IsUserBanned = IsUserBanned;
exports.BanUser = BanUser;
exports.UnbanUser = UnbanUser;
var config_1 = require("../../common/config");
var db_1 = require("../db");
var class_1 = require("./class");
function GetUserIdFromIdentifier(identifier, offset) {
    return db_1.db.column('SELECT userId FROM users WHERE license2 = ? LIMIT ?, 1', [identifier, offset || 0]);
}
function CreateUser(username, _a) {
    var license2 = _a.license2, steam = _a.steam, fivem = _a.fivem, discord = _a.discord;
    return db_1.db.insert('INSERT INTO users (username, license2, steam, fivem, discord) VALUES (?, ?, ?, ?, ?)', [
        username,
        license2,
        steam,
        fivem,
        discord,
    ]);
}
function GetUserAuthByUsername(username) {
    return db_1.db.single('SELECT userId, password_hash, banned FROM users WHERE username = ' + username + ' LIMIT 1');
}
/**
 * Get a username back from userId.
 */
function GetUsernameByUserId(userId) {
    return db_1.db.column('SELECT username FROM users WHERE userId = ? LIMIT 1', [userId]);
}
function IsStateIdAvailable(stateId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.exists('SELECT 1 FROM characters WHERE stateId = ?', [stateId])];
                case 1: return [2 /*return*/, !(_a.sent())];
            }
        });
    });
}
function CreateCharacter(userId, stateId, firstName, lastName, gender, date, phoneNumber) {
    return db_1.db.insert('INSERT INTO characters (userId, stateId, firstName, lastName, gender, dateOfBirth, phoneNumber) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, stateId, firstName, lastName, gender, new Date(Number(date)), phoneNumber]);
}
function GetCharacters(userId) {
    return db_1.db.execute('SELECT charId, stateId, firstName, lastName, gender, x, y, z, heading, DATE_FORMAT(lastPlayed, "%d/%m/%Y") AS lastPlayed FROM characters WHERE userId = ? AND deleted IS NULL LIMIT ?', [userId, config_1.CHARACTER_SLOTS]);
}
function SaveCharacterData(values, batch) {
    var query = 'UPDATE characters SET x = ?, y = ?, z = ?, heading = ?, isDead = ?, lastPlayed = CURRENT_TIMESTAMP(), health = ?, armour = ?, statuses = ? WHERE charId = ?';
    return batch ? db_1.db.batch(query, values) : db_1.db.update(query, values);
}
function DeleteCharacter(charId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update('UPDATE characters SET deleted = curdate() WHERE charId = ?', [charId])];
                case 1: return [2 /*return*/, (_a.sent()) === 1];
            }
        });
    });
}
function GetCharacterMetadata(charId) {
    return db_1.db.row('SELECT isDead, gender, DATE_FORMAT(dateOfBirth, "%d/%m/%Y") AS dateOfBirth, phoneNumber, health, armour, statuses FROM characters WHERE charId = ?', [charId]);
}
function GetStatuses() {
    return db_1.db.query('SELECT name, `default`, onTick FROM ox_statuses');
}
function GetLicenses() {
    return db_1.db.query('SELECT name, label FROM ox_licenses');
}
function GetLicense(name) {
    return db_1.db.row('SELECT name, label FROM ox_licenses WHERE name = ?', [name]);
}
function GetCharacterLicenses(charId) {
    return db_1.db.query('SELECT name, data FROM character_licenses WHERE charId = ?', [charId]);
}
function AddCharacterLicense(charId, name, data) {
    return db_1.db.update('INSERT INTO character_licenses (charId, name, data) VALUES (?, ?, ?)', [
        charId,
        name,
        JSON.stringify(data),
    ]);
}
function RemoveCharacterLicense(charId, name) {
    return db_1.db.update('DELETE FROM character_licenses WHERE charId = ? AND name = ?', [charId, name]);
}
function UpdateCharacterLicense(charId, name, key, value) {
    var params = ["$.".concat(key), name, charId];
    if (value == null)
        return db_1.db.update('UPDATE character_licenses SET data = JSON_REMOVE(data, ?) WHERE name = ? AND charId = ?', params);
    params.splice(1, 0, value);
    return db_1.db.update('UPDATE character_licenses SET data = JSON_SET(data, ?, ?) WHERE name = ? AND charId = ?', params);
}
function GetCharIdFromStateId(stateId) {
    return db_1.db.column('SELECT charId FROM characters WHERE stateId = ?', [stateId]);
}
function UpdateUserTokens(userId, tokens) {
    return __awaiter(this, void 0, void 0, function () {
        var parameters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parameters = tokens.map(function (token) { return [userId, token]; });
                    return [4 /*yield*/, db_1.db.batch('INSERT IGNORE INTO user_tokens (userId, token) VALUES (?, ?)', parameters)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function IsUserBanned(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var banDetails, currentDate, expiredBans;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.query("SELECT bu.reason, bu.banned_at, bu.unban_at, bu.userId, ut.token\n       FROM user_tokens ut\n       JOIN banned_users bu ON ut.userId = bu.userId\n       WHERE ut.userId = ?\n       GROUP BY bu.userId", [userId])];
                case 1:
                    banDetails = _a.sent();
                    if (!(banDetails === null || banDetails === void 0 ? void 0 : banDetails[0]))
                        return [2 /*return*/];
                    currentDate = new Date();
                    expiredBans = banDetails.filter(function (ban) { return ban.unban_at && new Date(ban.unban_at) <= currentDate; });
                    if (!(expiredBans.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, db_1.db.query("DELETE FROM banned_users WHERE userId IN (?)", [expiredBans.map(function (ban) { return ban.userId; })])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [2 /*return*/, banDetails[0]];
            }
        });
    });
}
function BanUser(userId, reason, hours) {
    return __awaiter(this, void 0, void 0, function () {
        var success, playerId, banned_at, unban_at;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db_1.db.update('INSERT INTO banned_users (userId, banned_at, unban_at, reason) VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL ? HOUR), ?)', [userId, hours, reason])];
                case 1:
                    success = _b.sent();
                    if (!success) {
                        console.error("Failed to ban ".concat(userId));
                        return [2 /*return*/, false];
                    }
                    playerId = (_a = class_1.OxPlayer.getFromUserId(userId)) === null || _a === void 0 ? void 0 : _a.source;
                    if (playerId) {
                        banned_at = Date.now();
                        unban_at = banned_at + (hours ? hours * 60 * 60 * 1000 : 0);
                        DropPlayer(playerId, class_1.OxPlayer.formatBanReason({ userId: userId, banned_at: banned_at, unban_at: unban_at, reason: reason }));
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
function UnbanUser(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update('DELETE FROM banned_users WHERE userId = ?', [userId])];
                case 1:
                    success = _a.sent();
                    return [2 /*return*/, success];
            }
        });
    });
}
