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
exports.CreateVehicle = CreateVehicle;
exports.SpawnVehicle = SpawnVehicle;
var class_1 = require("./class");
var db_1 = require("./db");
var vehicles_1 = require("../../common/vehicles");
var config_1 = require("../../common/config");
require("./class");
require("./commands");
require("./events");
if (config_1.DEBUG)
    Promise.resolve().then(function () { return require('./parser'); });
function CreateVehicle(data_1, coords_1, heading_1) {
    return __awaiter(this, arguments, void 0, function (data, coords, heading, invokingScript) {
        var vehicleData, vehicle_1, isOwned, _a, _b, _c, _d, _e, metadata, _f, properties, vehicle;
        var _g;
        if (invokingScript === void 0) { invokingScript = GetInvokingResource(); }
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (typeof data === 'string')
                        data = { model: data };
                    vehicleData = (0, vehicles_1.GetVehicleData)(data.model);
                    if (!vehicleData)
                        throw new Error("Failed to create vehicle '".concat(data.model, "' (model is invalid).\nEnsure vehicle exists in '@ox_core/common/data/vehicles.json'"));
                    if (data.id) {
                        vehicle_1 = class_1.OxVehicle.getFromVehicleId(data.id);
                        if (vehicle_1) {
                            if (vehicle_1.entity && DoesEntityExist(vehicle_1.entity)) {
                                return [2 /*return*/, vehicle_1];
                            }
                            vehicle_1.despawn(true);
                        }
                    }
                    isOwned = !!(data.owner || data.group);
                    if (!!data.vin) return [3 /*break*/, 2];
                    _a = data;
                    return [4 /*yield*/, class_1.OxVehicle.generateVin(vehicleData, isOwned)];
                case 1:
                    _a.vin = _h.sent();
                    _h.label = 2;
                case 2:
                    _b = data;
                    if (!(data.vin && data.plate)) return [3 /*break*/, 3];
                    _c = data.plate;
                    return [3 /*break*/, 9];
                case 3:
                    _e = data.plate;
                    if (!_e) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, db_1.IsPlateAvailable)(data.plate)];
                case 4:
                    _e = (_h.sent());
                    _h.label = 5;
                case 5:
                    if (!_e) return [3 /*break*/, 6];
                    _d = data.plate;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, class_1.OxVehicle.generatePlate()];
                case 7:
                    _d = _h.sent();
                    _h.label = 8;
                case 8:
                    _c = _d;
                    _h.label = 9;
                case 9:
                    _b.plate = _c;
                    metadata = data.data || {};
                    metadata.properties = data.properties || ((_g = data.data) === null || _g === void 0 ? void 0 : _g.properties) || {};
                    if (!(!data.id && data.vin && isOwned)) return [3 /*break*/, 11];
                    _f = data;
                    return [4 /*yield*/, (0, db_1.CreateNewVehicle)(data.plate, data.vin, data.owner || null, data.group || null, data.model, vehicleData.class, metadata, data.stored || null)];
                case 10:
                    _f.id = _h.sent();
                    _h.label = 11;
                case 11:
                    properties = data.properties || metadata.properties || {};
                    delete metadata.properties;
                    vehicle = new class_1.OxVehicle(data.vin, invokingScript, data.plate, data.model, vehicleData.make, data.stored || null, metadata, properties, data.id, data.owner, data.group);
                    if (coords) {
                        vehicle.respawn(coords, heading || 0);
                    }
                    if (vehicle.entity)
                        vehicle.setStored(null, false);
                    return [2 /*return*/, vehicle];
            }
        });
    });
}
function SpawnVehicle(id, coords, heading) {
    return __awaiter(this, void 0, void 0, function () {
        var invokingScript, vehicle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invokingScript = GetInvokingResource();
                    return [4 /*yield*/, (0, db_1.GetStoredVehicleFromId)(id, typeof id === 'string' ? 'vin' : 'id')];
                case 1:
                    vehicle = _a.sent();
                    if (!vehicle)
                        return [2 /*return*/];
                    return [4 /*yield*/, CreateVehicle(vehicle, coords, heading, invokingScript)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports('CreateVehicle', CreateVehicle);
exports('SpawnVehicle', SpawnVehicle);
