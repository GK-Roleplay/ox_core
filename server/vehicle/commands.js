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
exports.DeleteCurrentVehicle = DeleteCurrentVehicle;
var server_1 = require("@communityox/ox_lib/server");
var class_1 = require("./class");
var ox_lib_1 = require("@communityox/ox_lib");
var vehicle_1 = require("vehicle");
var class_2 = require("player/class");
function DeleteCurrentVehicle(ped) {
    var entity = GetVehiclePedIsIn(ped, false);
    if (!entity)
        return;
    var vehicle = class_1.OxVehicle.getFromEntity(entity);
    if (!vehicle)
        return DeleteEntity(entity);
    vehicle.setStored('impound', true);
    vehicle.remove();
}
(0, server_1.addCommand)('car', function (playerId, args, raw) { return __awaiter(void 0, void 0, void 0, function () {
    var ped, player, data, vehicle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ped = playerId && GetPlayerPed(playerId);
                if (!ped)
                    return [2 /*return*/];
                player = args.owner ? class_2.OxPlayer.get(args.owner) : null;
                data = {
                    model: args.model,
                    owner: (player === null || player === void 0 ? void 0 : player.charId) || undefined,
                };
                return [4 /*yield*/, (0, vehicle_1.CreateVehicle)(data, GetEntityCoords(ped), GetEntityHeading(ped))];
            case 1:
                vehicle = _a.sent();
                if (!vehicle.entity)
                    return [2 /*return*/, vehicle.remove()];
                DeleteCurrentVehicle(ped);
                return [4 /*yield*/, (0, ox_lib_1.sleep)(200)];
            case 2:
                _a.sent();
                SetPedIntoVehicle(ped, vehicle.entity, -1);
                return [2 /*return*/];
        }
    });
}); }, {
    help: 'Spawn a vehicle with the given model.',
    params: [
        { name: 'model', paramType: 'string', help: 'The vehicle archetype.' },
        {
            name: 'owner',
            paramType: 'playerId',
            help: "Create a persistent vehicle owned by the target's active character.",
            optional: true,
        },
    ],
    restricted: 'group.admin',
});
(0, server_1.addCommand)('dv', function (playerId, args, raw) { return __awaiter(void 0, void 0, void 0, function () {
    var ped, vehicles;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ped = GetPlayerPed(playerId);
                if (!args.radius)
                    return [2 /*return*/, DeleteCurrentVehicle(ped)];
                return [4 /*yield*/, (0, server_1.triggerClientCallback)('ox:getNearbyVehicles', playerId, args.radius)];
            case 1:
                vehicles = _a.sent();
                if (!vehicles)
                    return [2 /*return*/];
                vehicles.forEach(function (netId) {
                    var vehicle = class_1.OxVehicle.getFromNetId(netId);
                    if (!vehicle)
                        DeleteEntity(NetworkGetEntityFromNetworkId(netId));
                    else if (args.owned) {
                        vehicle.setStored('impound', true);
                        vehicle.remove();
                    }
                });
                return [2 /*return*/];
        }
    });
}); }, {
    help: 'Deletes your current vehicle, or any vehicles within range.',
    params: [
        { name: 'radius', paramType: 'number', help: 'The radius to despawn vehicles (defaults to 2).', optional: true },
        { name: 'owned', help: 'Include player-owned vehicles.', optional: true },
    ],
    restricted: 'group.admin',
});
