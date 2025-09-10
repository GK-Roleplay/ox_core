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
exports.GetPlayer = GetPlayer;
exports.GetPlayerFromUserId = GetPlayerFromUserId;
exports.GetPlayerFromCharId = GetPlayerFromCharId;
exports.GetPlayers = GetPlayers;
exports.GetPlayerFromFilter = GetPlayerFromFilter;
var account_1 = require("./account");
var PlayerInterface = /** @class */ (function () {
    function PlayerInterface(source, userId, charId, stateId, username, identifier, ped) {
        this.source = source;
        this.userId = userId;
        this.charId = charId;
        this.stateId = stateId;
        this.username = username;
        this.identifier = identifier;
        this.ped = ped;
        this.source = source;
        this.userId = userId;
        this.charId = charId;
        this.stateId = stateId;
        this.username = username;
        this.identifier = identifier;
        this.ped = ped;
    }
    PlayerInterface.prototype.getCoords = function () {
        return GetEntityCoords(this.ped);
    };
    PlayerInterface.prototype.getState = function () {
        return Player(source).state;
    };
    PlayerInterface.prototype.getAccount = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.charId ? (0, account_1.GetCharacterAccount)(this.charId) : null];
            });
        });
    };
    return PlayerInterface;
}());
Object.keys(exports.ox_core.GetPlayerCalls()).forEach(function (method) {
    PlayerInterface.prototype[method] = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return (_a = exports.ox_core).CallPlayer.apply(_a, __spreadArray([this.source, method], args, false));
    };
});
PlayerInterface.prototype.toString = function () {
    return JSON.stringify(this, null, 2);
};
function CreatePlayerInstance(player) {
    if (!player)
        return;
    return new PlayerInterface(player.source, player.userId, player.charId, player.stateId, player.username, player.identifier, player.ped);
}
function GetPlayer(playerId) {
    return CreatePlayerInstance(exports.ox_core.GetPlayer(playerId));
}
function GetPlayerFromUserId(userId) {
    return CreatePlayerInstance(exports.ox_core.GetPlayerFromUserId(userId));
}
function GetPlayerFromCharId(charId) {
    return CreatePlayerInstance(exports.ox_core.GetPlayerFromCharId(charId));
}
function GetPlayers(filter) {
    var players = exports.ox_core.GetPlayers(filter);
    for (var id in players)
        players[id] = CreatePlayerInstance(players[id]);
    return players;
}
function GetPlayerFromFilter(filter) {
    return CreatePlayerInstance(exports.ox_core.GetPlayerFromFilter(filter));
}
