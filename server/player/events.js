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
exports.OnPlayerLoaded = OnPlayerLoaded;
exports.OnPlayerLogout = OnPlayerLogout;
var server_1 = require("@communityox/ox_lib/server");
var class_1 = require("./class");
var ox_lib_1 = require("@communityox/ox_lib");
var db_1 = require("db");
var status_1 = require("./status");
var db_2 = require("accounts/db");
var config_1 = require("config");
require("./license");
var playerLoadEvents = {};
var playerLogoutEvents = [];
/** Triggers a callback when a player is fully loaded, or when the resource starts.  */
function OnPlayerLoaded(resource, cb) {
    playerLoadEvents[resource] = cb;
}
/** Triggers a callback when a player logs out. */
function OnPlayerLogout(cb) {
    playerLogoutEvents.push(cb);
}
on('ox:playerLoaded', function (playerId) {
    for (var resource in playerLoadEvents) {
        var player = class_1.OxPlayer.get(playerId);
        if (player.charId)
            try {
                playerLoadEvents[resource](player);
            }
            catch (e) {
                DEV: console.info(e.message);
            }
    }
});
on('onServerResourceStart', function (resource) { return __awaiter(void 0, void 0, void 0, function () {
    var event, players, id, player;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event = playerLoadEvents[resource];
                if (!event)
                    return [2 /*return*/];
                return [4 /*yield*/, (0, ox_lib_1.sleep)(1000)];
            case 1:
                _a.sent();
                players = class_1.OxPlayer.getAll();
                for (id in players) {
                    player = players[id];
                    if (player.charId)
                        try {
                            event(player);
                        }
                        catch (e) {
                            DEV: console.info(e.message);
                        }
                }
                return [2 /*return*/];
        }
    });
}); });
on('ox:playerLogout', function (playerId) {
    var player = class_1.OxPlayer.get(playerId);
    if (player.charId)
        for (var i in playerLogoutEvents)
            try {
                playerLogoutEvents[i](player);
            }
            catch (e) {
                DEV: console.info(e.message);
            }
});
on('onResourceStop', function (resource) {
    if (resource !== 'ox_core')
        return;
    var players = class_1.OxPlayer.getAll();
    for (var id in players) {
        var player = players[id];
        if (player.charId)
            emit('ox:playerLogout', player.source, player.userId, player.charId);
    }
});
onNet('ox:setActiveCharacter', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var player;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                player = class_1.OxPlayer.get(source);
                if (!player)
                    return [2 /*return*/];
                return [4 /*yield*/, player.setActiveCharacter(data)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
(0, server_1.onClientCallback)('ox:deleteCharacter', function (playerId, charId) { return __awaiter(void 0, void 0, void 0, function () {
    var player;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                player = class_1.OxPlayer.get(playerId);
                if (!player)
                    return [2 /*return*/];
                return [4 /*yield*/, player.deleteCharacter(charId)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); });
on('ox:createdCharacter', function (playerId, userId, charId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        db_1.db.execute('INSERT INTO character_inventory (charId) VALUES (?)', [charId]);
        if (config_1.CREATE_DEFAULT_ACCOUNT)
            (0, db_2.CreateNewAccount)(charId, 'Personal', true);
        return [2 /*return*/];
    });
}); });
onNet('ox:updateStatuses', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var player, name_1, status_2, value;
    return __generator(this, function (_a) {
        player = class_1.OxPlayer.get(source);
        if (!player)
            return [2 /*return*/];
        for (name_1 in data) {
            status_2 = status_1.Statuses[name_1];
            value = data[name_1];
            if (status_2 && typeof value === 'number') {
                player.setStatus(name_1, value);
            }
        }
        return [2 /*return*/];
    });
}); });
(0, server_1.onClientCallback)('ox:setActiveGroup', function (playerId, groupName) {
    var player = class_1.OxPlayer.get(playerId);
    if (!player)
        return false;
    return player.setActiveGroup(groupName);
});
(0, server_1.onClientCallback)('ox:getLicense', function (playerId, licenseName, target) {
    var player = class_1.OxPlayer.get(target || playerId);
    if (player)
        return licenseName ? player.getLicense(licenseName) : player.getLicenses();
});
