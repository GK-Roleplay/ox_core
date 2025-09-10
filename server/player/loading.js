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
var class_1 = require("player/class");
var db_1 = require("./db");
var utils_1 = require("utils");
var config_1 = require("../config");
var locales_1 = require("../../common/locales");
var bcryptjs_1 = require("bcryptjs");
var connectingPlayers = {};
/** Loads existing data for the player, or inserts new data into the database. */
function loadPlayer(playerId) {
    return __awaiter(this, void 0, void 0, function () {
        var player, license, identifier, userId, kickReason, tokens, ban, _a, _b, err_1;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 9, , 10]);
                    if (serverLockdown)
                        return [2 /*return*/, serverLockdown];
                    player = new class_1.OxPlayer(playerId);
                    license = config_1.SV_LAN ? 'fayoum' : (0, utils_1.GetPlayerLicense)(playerId);
                    if (!license)
                        return [2 /*return*/, (0, locales_1.default)('no_license')];
                    identifier = license.substring(license.indexOf(':') + 1);
                    userId = void 0;
                    return [4 /*yield*/, (0, db_1.GetUserIdFromIdentifier)(identifier)];
                case 1:
                    userId = (_c = (_e.sent())) !== null && _c !== void 0 ? _c : 0;
                    if (!(userId && class_1.OxPlayer.getFromUserId(userId))) return [3 /*break*/, 3];
                    kickReason = (0, locales_1.default)('userid_is_active', userId);
                    if (!config_1.DEBUG)
                        return [2 /*return*/, kickReason];
                    return [4 /*yield*/, (0, db_1.GetUserIdFromIdentifier)(identifier, 1)];
                case 2:
                    userId = (_d = (_e.sent())) !== null && _d !== void 0 ? _d : 0;
                    if (userId && class_1.OxPlayer.getFromUserId(userId))
                        return [2 /*return*/, kickReason];
                    _e.label = 3;
                case 3:
                    tokens = getPlayerTokens(playerId);
                    return [4 /*yield*/, (0, db_1.UpdateUserTokens)(userId, tokens)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, (0, db_1.IsUserBanned)(userId)];
                case 5:
                    ban = _e.sent();
                    if (ban) {
                        return [2 /*return*/, class_1.OxPlayer.formatBanReason(ban)];
                    }
                    player.username = GetPlayerName(player.source);
                    _a = player;
                    if (!userId) return [3 /*break*/, 6];
                    _b = userId;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, (0, db_1.CreateUser)(player.username, (0, utils_1.GetIdentifiers)(playerId))];
                case 7:
                    _b = _e.sent();
                    _e.label = 8;
                case 8:
                    _a.userId = _b;
                    player.identifier = identifier;
                    DEV: console.info("Loaded player data for OxPlayer<".concat(player.userId, ">"));
                    return [2 /*return*/, player];
                case 9:
                    err_1 = _e.sent();
                    console.error('Error loading player:', err_1);
                    if (player === null || player === void 0 ? void 0 : player.userId) {
                        try {
                            class_1.OxPlayer.remove(player.source);
                        }
                        catch (cleanupErr) {
                            console.error('Error during cleanup:', cleanupErr);
                        }
                    }
                    return [2 /*return*/, err_1.message];
                case 10: return [2 /*return*/];
            }
        });
    });
}
var serverLockdown;
setInterval(function () {
    for (var tempId in connectingPlayers) {
        if (!DoesPlayerExist(tempId))
            delete connectingPlayers[tempId];
    }
}, 10000);
on('txAdmin:events:serverShuttingDown', function () {
    serverLockdown = (0, locales_1.default)('server_restarting');
    class_1.OxPlayer.saveAll(serverLockdown);
});
on('playerConnecting', function (name, setKickReason, deferrals) {
    var src = source;
    deferrals.defer();
    // Optional: you can set a "please wait" message here
    deferrals.update("Welcome ".concat(name, ", opening login UI..."));
    // Open the NUI login screen on the client
    emitNet('ox:nui:open', src);
    // Immediately finish deferral (player enters, but frozen in NUI focus)
    deferrals.done();
});
on('playerJoining', function (tempId) { return __awaiter(void 0, void 0, void 0, function () {
    var player;
    return __generator(this, function (_a) {
        if (serverLockdown)
            return [2 /*return*/, DropPlayer(source.toString(), serverLockdown)];
        player = connectingPlayers[tempId];
        if (!player)
            return [2 /*return*/];
        delete connectingPlayers[tempId];
        connectingPlayers[source] = player;
        player.source = source;
        DEV: console.info("Assigned id ".concat(source, " to OxPlayer<").concat(player.userId, ">"));
        return [2 /*return*/];
    });
}); });
on('ox:playerJoined', function () { return __awaiter(void 0, void 0, void 0, function () {
    var playerSrc, player, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                playerSrc = source;
                _a = connectingPlayers[playerSrc];
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, loadPlayer(playerSrc)];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                player = _a;
                delete connectingPlayers[playerSrc];
                if (!(player instanceof class_1.OxPlayer))
                    return [2 /*return*/, DropPlayer(playerSrc.toString(), player || 'Failed to load player.')];
                player.setAsJoined();
                return [2 /*return*/];
        }
    });
}); });
on('playerDropped', function () {
    var player = class_1.OxPlayer.get(source);
    if (!player)
        return;
    player.logout(true, true);
    class_1.OxPlayer.remove(player.source);
    DEV: console.info("Dropped OxPlayer<".concat(player.userId, ">"));
});
RegisterCommand('saveplayers', function () {
    class_1.OxPlayer.saveAll();
}, true);
// --- Manual login state ---
var loginOverride = {};
var loginVerified = new Set();
var joinedPending = new Set();
function setLoginOverride(src, userId) { loginOverride[src] = userId; }
// --- Manual login: username/password ---
onNet('ox:submitLogin', function (username, password) { return __awaiter(void 0, void 0, void 0, function () {
    var src, row, ok;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                src = source;
                if (!username || !password)
                    return [2 /*return*/, emitNet('ox:loginResult', src, false, 'Missing credentials.')];
                return [4 /*yield*/, (0, db_1.GetUserAuthByUsername)(username)];
            case 1:
                row = _a.sent();
                if (!(row === null || row === void 0 ? void 0 : row.userId) || !row.password_hash)
                    return [2 /*return*/, emitNet('ox:loginResult', src, false, 'Invalid username or password.')];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, row.password_hash)];
            case 2:
                ok = _a.sent();
                if (!ok)
                    return [2 /*return*/, emitNet('ox:loginResult', src, false, 'Invalid username or password.')];
                setLoginOverride(src, row.userId);
                emitNet('ox:loginResult', src, true, 'Login successful.');
                return [2 /*return*/];
        }
    });
}); });
