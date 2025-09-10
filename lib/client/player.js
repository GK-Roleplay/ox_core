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
var client_1 = require("@communityox/ox_lib/client");
var PlayerInterface = /** @class */ (function () {
    function PlayerInterface() {
        var _this = this;
        try {
            var _a = exports.ox_core.GetPlayer(), userId = _a.userId, charId = _a.charId, stateId = _a.stateId;
            this.userId = userId;
            this.charId = charId;
            this.stateId = stateId;
        }
        catch (e) { }
        this.state = LocalPlayer.state;
        this.constructor.prototype.toString = function () {
            return JSON.stringify(_this, null, 2);
        };
        var getMethods = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                Object.keys(exports.ox_core.GetPlayerCalls()).forEach(function (method) {
                    if (!_this.constructor.prototype[method])
                        _this.constructor.prototype[method] = function () {
                            var _a;
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return (_a = exports.ox_core).CallPlayer.apply(_a, __spreadArray([method], args, false));
                        };
                });
                return [2 /*return*/];
            });
        }); };
        // Prevent errors if resource starts before ox_core (generally during development)
        getMethods().catch(function () { return setImmediate(getMethods); });
    }
    /**
     * Registers an event handler which will be triggered when the specified player data is updated.
     */
    PlayerInterface.prototype.on = function (key, callback) {
        this.get(key);
        on("ox:player:".concat(key), function (data) {
            if (GetInvokingResource() == 'ox_core' && source === '')
                callback(data);
        });
    };
    /**
     * Returns player data for the specified key. The data is cached and kept updated for future calls.
     */
    PlayerInterface.prototype.get = function (key) {
        var _this = this;
        var _a;
        if (!this.charId)
            return;
        if (!(key in this)) {
            this[key] = (_a = exports.ox_core.CallPlayer('get', key)) !== null && _a !== void 0 ? _a : null;
            this.on(key, function (data) { return (_this[key] = data); });
        }
        return this[key];
    };
    PlayerInterface.prototype.getCoords = function () {
        return GetEntityCoords(client_1.cache.ped);
    };
    return PlayerInterface;
}());
var player = new PlayerInterface();
function GetPlayer() {
    return player;
}
on('ox:playerLoaded', function (data) {
    if (player.charId)
        return;
    for (var key in data)
        player[key] = data[key];
});
on('ox:playerLogout', function () {
    for (var key in player)
        delete player[key];
});
