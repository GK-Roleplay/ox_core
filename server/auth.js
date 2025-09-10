"use strict";
// server/auth.ts
// Username/password login + registration for GK:RP NUI
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
var bcryptjs_1 = require("bcryptjs");
var db_1 = require("./db");
var loading_1 = require("./player/loading");
var db_2 = require("./player/db");
var db_3 = require("./player/db");
function postClient(src, action, payload) {
    if (action === 'alert') {
        emitNet('ox:nui:alert', src, (payload === null || payload === void 0 ? void 0 : payload.type) || 'error', (payload === null || payload === void 0 ? void 0 : payload.message) || '');
    }
    else if (action === 'open') {
        emitNet('ox:nui:open', src);
    }
    else if (action === 'close') {
        emitNet('ox:nui:close', src);
    }
}
function isUsernameTaken(username) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.exists('SELECT 1 FROM users WHERE username = ?', [username])];
                case 1: return [2 /*return*/, !!(_a.sent())];
            }
        });
    });
}
function dobFromAge(age) {
    var now = new Date();
    var year = now.getUTCFullYear() - Math.max(18, Math.min(80, Math.floor(age || 21)));
    return new Date(Date.UTC(year, 0, 1));
}
function generateStateId() {
    return __awaiter(this, void 0, void 0, function () {
        var i, candidate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 50)) return [3 /*break*/, 4];
                    candidate = 'GK' + Math.floor(100000 + Math.random() * 900000).toString();
                    return [4 /*yield*/, (0, db_2.IsStateIdAvailable)(candidate)];
                case 2:
                    if (_a.sent())
                        return [2 /*return*/, candidate];
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: 
                // fallback to timestamp
                return [2 /*return*/, 'GK' + Date.now().toString().slice(-6)];
            }
        });
    });
}
// LOGIN
onNet('ox:auth:login', function (username, password) { return __awaiter(void 0, void 0, void 0, function () {
    console.log("dsadsadsadsadsadsadsadsa")
    var src, row, ok, tokens, ban, player, e_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                src = Number(GetPlayerServerId(source));
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                if (!username || !password) {
                    return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: 'Missing credentials.' })];
                }
                return [4 /*yield*/, (0, db_3.GetUserAuthByUsername)(username)];
            case 2:
                row = _c.sent();
                if (!(row === null || row === void 0 ? void 0 : row.userId) || !row.password_hash) {
                    return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: 'Invalid username or password.' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, row.password_hash)];
            case 3:
                ok = _c.sent();
                if (!ok) {
                    return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: 'Invalid username or password.' })];
                }
                tokens = getPlayerTokens(src);
                return [4 /*yield*/, (0, db_2.UpdateUserTokens)(row.userId, tokens)];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, db_2.IsUserBanned)(row.userId)];
            case 5:
                ban = _c.sent();
                if (ban) {
                    return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: "Banned: ".concat(ban.reason || 'No reason') })];
                }
                return [4 /*yield*/, (0, loading_1.loadPlayer)(src, /*forceUserId*/ row.userId)];
            case 6:
                player = _c.sent();
                if (typeof player !== 'object') {
                    return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: player || 'Failed to load player.' })];
                }
                // Close UI and proceed
                postClient(src, 'alert', { type: 'success', message: 'Login successful. Loading...' });
                postClient(src, 'close');
                (_b = (_a = player).setAsJoined) === null || _b === void 0 ? void 0 : _b.call(_a);
                return [3 /*break*/, 8];
            case 7:
                e_1 = _c.sent();
                console.error('Login error', e_1);
                return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: 'Login failed. Try again.' })];
            case 8: return [2 /*return*/];
        }
    });
}); });
// REGISTER
onNet('ox:auth:register', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var src, _a, username, password, ped, first_name, last_name, age, description, password_hash, userId, stateId, dob, charId, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                src = Number(GetPlayerServerId(source));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                _a = data || {}, username = _a.username, password = _a.password, ped = _a.ped, first_name = _a.first_name, last_name = _a.last_name, age = _a.age, description = _a.description;
                if (!username || !password || !first_name || !last_name || !ped) {
                    return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: 'Missing required fields.' })];
                }
                return [4 /*yield*/, isUsernameTaken(username)];
            case 2:
                if (_b.sent()) {
                    return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: 'Username already taken.' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 3:
                password_hash = _b.sent();
                return [4 /*yield*/, db_1.db.insert('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, password_hash])];
            case 4:
                userId = _b.sent();
                if (!userId) {
                    return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: 'Failed to create account.' })];
                }
                return [4 /*yield*/, generateStateId()];
            case 5:
                stateId = _b.sent();
                dob = dobFromAge(age);
                return [4 /*yield*/, (0, db_2.CreateCharacter)(userId, stateId, first_name, last_name, 'other', +dob)];
            case 6:
                charId = _b.sent();
                // Optional: store ped + bio if you added columns
                // await db.update('UPDATE characters SET model = ?, bio = ? WHERE charId = ?', [ped, description?.slice(0, 400) || null, charId]);
                postClient(src, 'alert', { type: 'success', message: 'Registration successful. You can now log in.' });
                return [3 /*break*/, 8];
            case 7:
                e_2 = _b.sent();
                console.error('Register error', e_2);
                return [2 /*return*/, postClient(src, 'alert', { type: 'error', message: 'Registration failed. Try again.' })];
            case 8: return [2 /*return*/];
        }
    });
}); });
