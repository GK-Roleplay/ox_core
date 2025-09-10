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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxVehicle = void 0;
var classInterface_1 = require("classInterface");
var db_1 = require("./db");
var ox_lib_1 = require("@communityox/ox_lib");
var config_1 = require("../../common/config");
var vehicles_1 = require("../../common/vehicles");
var server_1 = require("@communityox/ox_lib/server");
var server_2 = require("@nativewrappers/server");
var vehicle_1 = require("vehicle");
var setEntityOrphanMode = typeof SetEntityOrphanMode !== 'undefined' ? SetEntityOrphanMode : function () { };
var OxVehicle = /** @class */ (function (_super) {
    __extends(OxVehicle, _super);
    function OxVehicle(vin, script, plate, model, make, stored, metadata, properties, id, owner, group) {
        var _this = _super.call(this) || this;
        _OxVehicle_instances.add(_this);
        _OxVehicle_metadata.set(_this, void 0);
        _OxVehicle_properties.set(_this, void 0);
        _OxVehicle_stored.set(_this, void 0);
        _this.script = script;
        _this.plate = plate;
        _this.model = model;
        _this.make = make;
        _this.id = id;
        _this.vin = vin;
        _this.owner = owner;
        _this.group = group;
        __classPrivateFieldSet(_this, _OxVehicle_properties, properties, "f");
        __classPrivateFieldSet(_this, _OxVehicle_metadata, metadata || {}, "f");
        __classPrivateFieldSet(_this, _OxVehicle_stored, stored, "f");
        OxVehicle.add(_this.vin, _this);
        return _this;
    }
    OxVehicle.spawn = function (model, coords, heading) {
        var entityId = CreateVehicleServerSetter(model, (0, vehicles_1.GetVehicleNetworkType)(model), coords.x, coords.y, coords.z, heading || 0);
        setEntityOrphanMode(entityId, 2);
        return entityId;
    };
    /** Get an instance of OxVehicle with the matching vin. */
    OxVehicle.get = function (vin) {
        var vehicle = this.members[vin];
        if (vehicle)
            return vehicle;
        return (0, vehicle_1.SpawnVehicle)(vin);
    };
    /** Get an instance of OxVehicle with the matching vehicleId. */
    OxVehicle.getFromVehicleId = function (vehicleId) {
        return this.keys.id[vehicleId];
    };
    /** Get an instance of OxVehicle with the matching netId. */
    OxVehicle.getFromNetId = function (id) {
        return this.keys.netId[id];
    };
    /** Get an instance of OxVehicle with the matching entityId. */
    OxVehicle.getFromEntity = function (entityId) {
        return this.keys.entity[entityId];
    };
    /** Compares vehicle fields and metadata to a filter, returning the vehicle if all values match. */
    OxVehicle.prototype.filter = function (criteria) {
        for (var key in criteria) {
            var value = criteria[key];
            if (this[key] !== value && __classPrivateFieldGet(this, _OxVehicle_metadata, "f")[key] !== value)
                return;
        }
        return this;
    };
    /** Get an instance of OxVehicle that matches the filter. */
    OxVehicle.getFromFilter = function (filter) {
        for (var id in this.members) {
            var vehicle = this.members[id].filter(filter);
            if (vehicle)
                return vehicle;
        }
    };
    OxVehicle.getAll = function (filter, asArray) {
        if (asArray === void 0) { asArray = false; }
        if (!filter)
            return asArray ? Object.values(this.members) : this.members;
        var obj = {};
        for (var id in this.members) {
            var vehicle = this.members[id].filter(filter);
            if (vehicle)
                obj[id] = vehicle;
        }
        return asArray ? Object.values(obj) : obj;
    };
    OxVehicle.generateVin = function (_a) {
        return __awaiter(this, arguments, void 0, function (_b, isOwned) {
            var arr, vin, _c;
            var make = _b.make, name = _b.name;
            if (isOwned === void 0) { isOwned = true; }
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!name)
                            throw new Error('generateVin received invalid VehicleData (invalid model)');
                        arr = [
                            (0, ox_lib_1.getRandomInt)(),
                            make ? make.slice(0, 2).toUpperCase() : 'OX',
                            name.slice(0, 2).toUpperCase(),
                            null,
                            null,
                            Math.floor(Date.now() / 1000),
                        ];
                        _d.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 4];
                        arr[3] = (0, ox_lib_1.getRandomAlphanumeric)();
                        arr[4] = (0, ox_lib_1.getRandomChar)();
                        vin = arr.join('');
                        _c = !isOwned;
                        if (_c) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, db_1.IsVinAvailable)(vin)];
                    case 2:
                        _c = (_d.sent());
                        _d.label = 3;
                    case 3:
                        if (_c)
                            return [3 /*break*/, 4];
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, isOwned ? vin : "T".concat(vin)];
                }
            });
        });
    };
    OxVehicle.generatePlate = function () {
        return __awaiter(this, arguments, void 0, function (pattern) {
            var plate;
            if (pattern === void 0) { pattern = config_1.PLATE_PATTERN; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 2];
                        plate = (0, ox_lib_1.getRandomString)(pattern);
                        return [4 /*yield*/, (0, db_1.IsPlateAvailable)(plate)];
                    case 1:
                        if (_a.sent())
                            return [2 /*return*/, plate];
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    OxVehicle.saveAll = function (resource) {
        if (resource === 'ox_core')
            resource = '';
        var parameters = [];
        for (var id in this.members) {
            var vehicle = this.members[id];
            if (!resource || resource === vehicle.script) {
                if (vehicle.owner || vehicle.group) {
                    __classPrivateFieldSet(vehicle, _OxVehicle_stored, 'impound', "f");
                    parameters.push(__classPrivateFieldGet(vehicle, _OxVehicle_instances, "m", _OxVehicle_getSaveData).call(vehicle));
                }
                vehicle.remove();
            }
        }
        DEV: console.info("Saving ".concat(parameters.length, " vehicles to the database."));
        if (parameters.length > 0) {
            (0, db_1.SaveVehicleData)(parameters, true);
            emit('ox:savedVehicles', parameters.length);
        }
    };
    /** Stores a value in the vehicle's metadata. */
    OxVehicle.prototype.set = function (key, value) {
        __classPrivateFieldGet(this, _OxVehicle_metadata, "f")[key] = value;
    };
    /** Gets a value stored in vehicle's metadata. */
    OxVehicle.prototype.get = function (key) {
        return __classPrivateFieldGet(this, _OxVehicle_metadata, "f")[key];
    };
    OxVehicle.prototype.getState = function () {
        return this.entity ? Entity(this.entity).state : null;
    };
    OxVehicle.prototype.getStored = function () {
        return __classPrivateFieldGet(this, _OxVehicle_stored, "f");
    };
    OxVehicle.prototype.getProperties = function () {
        return __classPrivateFieldGet(this, _OxVehicle_properties, "f");
    };
    OxVehicle.prototype.save = function () {
        var saveData = __classPrivateFieldGet(this, _OxVehicle_instances, "m", _OxVehicle_getSaveData).call(this);
        return saveData && (0, db_1.SaveVehicleData)(saveData);
    };
    OxVehicle.prototype.despawn = function (save) {
        if (!this.entity)
            return;
        emit('ox:despawnVehicle', this.entity, this.id);
        var saveData = save && __classPrivateFieldGet(this, _OxVehicle_instances, "m", _OxVehicle_getSaveData).call(this);
        if (saveData)
            (0, db_1.SaveVehicleData)(saveData);
        if (DoesEntityExist(this.entity))
            DeleteEntity(this.entity);
    };
    OxVehicle.prototype.delete = function () {
        if (this.id)
            (0, db_1.DeleteVehicle)(this.id);
        this.despawn(false);
        OxVehicle.remove(this.vin);
    };
    OxVehicle.prototype.remove = function () {
        this.despawn(true);
        OxVehicle.remove(this.vin);
    };
    OxVehicle.prototype.setStored = function (value, despawn) {
        __classPrivateFieldSet(this, _OxVehicle_stored, value, "f");
        if (despawn)
            return this.remove();
        (0, db_1.SetVehicleColumn)(this.id, 'stored', value);
    };
    OxVehicle.prototype.setOwner = function (charId) {
        if (this.owner === charId)
            return;
        charId ? (this.owner = charId) : delete this.owner;
        (0, db_1.SetVehicleColumn)(this.id, 'owner', this.owner);
    };
    OxVehicle.prototype.setGroup = function (group) {
        if (this.group === group)
            return;
        group ? (this.group = group) : delete this.group;
        (0, db_1.SetVehicleColumn)(this.id, 'group', this.group);
    };
    OxVehicle.prototype.setPlate = function (plate) {
        if (this.plate === plate)
            return;
        this.plate = plate.length > 8 ? plate.substring(0, 8) : plate.padEnd(8);
        (0, db_1.SetVehicleColumn)(this.id, 'plate', this.plate);
    };
    OxVehicle.prototype.setProperties = function (properties, apply) {
        if (!this.entity)
            return;
        __classPrivateFieldSet(this, _OxVehicle_properties, typeof properties === 'string' ? JSON.parse(properties) : properties, "f");
        if (apply)
            (0, server_1.setVehicleProperties)(this.entity, __classPrivateFieldGet(this, _OxVehicle_properties, "f"));
    };
    OxVehicle.prototype.respawn = function (coords, rotation) {
        if (rotation === void 0) { rotation = 0; }
        var hasEntity = !!this.entity && DoesEntityExist(this.entity);
        if (!coords && hasEntity) {
            coords = GetEntityCoords(this.entity);
        }
        else if (coords) {
            coords = server_2.Vector3.fromObject(coords);
        }
        if (!coords)
            return null;
        rotation =
            typeof rotation === 'number'
                ? rotation
                : server_2.Vector3.fromObject(rotation || hasEntity ? GetEntityRotation(this.entity) : null);
        // Clean up existing entity and registry entries before spawning new one
        if (hasEntity) {
            emit('ox:despawnVehicle', this.entity, this.id);
            DeleteEntity(this.entity);
        }
        // Remove from registry before creating new entity to avoid conflicts
        OxVehicle.remove(this.vin);
        // Create new entity
        this.entity = OxVehicle.spawn(this.model, coords, typeof rotation === 'number' ? rotation : 0);
        this.netId = NetworkGetNetworkIdFromEntity(this.entity);
        if (typeof rotation !== 'number')
            SetEntityRotation(this.entity, rotation.x, rotation.y, rotation.z, 2, false);
        // Re-add to registry after successful spawn
        OxVehicle.add(this.vin, this);
        SetVehicleNumberPlateText(this.entity, __classPrivateFieldGet(this, _OxVehicle_properties, "f").plate || this.plate);
        (0, server_1.setVehicleProperties)(this.entity, __classPrivateFieldGet(this, _OxVehicle_properties, "f"));
        emit('ox:spawnedVehicle', this.entity, this.id);
        var state = this.getState();
        if (state)
            state.set('initVehicle', true, true);
        return this.entity;
    };
    var _OxVehicle_instances, _OxVehicle_metadata, _OxVehicle_properties, _OxVehicle_stored, _OxVehicle_getSaveData;
    _OxVehicle_metadata = new WeakMap(), _OxVehicle_properties = new WeakMap(), _OxVehicle_stored = new WeakMap(), _OxVehicle_instances = new WeakSet(), _OxVehicle_getSaveData = function _OxVehicle_getSaveData() {
        if (!this.id)
            return;
        return [__classPrivateFieldGet(this, _OxVehicle_stored, "f"), JSON.stringify(__assign(__assign({}, __classPrivateFieldGet(this, _OxVehicle_metadata, "f")), { properties: __classPrivateFieldGet(this, _OxVehicle_properties, "f") })), this.id];
    };
    OxVehicle.members = {};
    OxVehicle.keys = {
        id: {},
        netId: {},
        entity: {},
    };
    return OxVehicle;
}(classInterface_1.ClassInterface));
exports.OxVehicle = OxVehicle;
OxVehicle.init();
exports('SaveAllVehicles', function (arg) { return OxVehicle.saveAll(arg); });
exports('GetVehicleFromNetId', function (arg) { return OxVehicle.getFromNetId(arg); });
exports('GetVehicleFromVin', function (arg) { return OxVehicle.get(arg); });
exports('GetVehicleFromEntity', function (arg) { return OxVehicle.getFromEntity(arg); });
exports('GetVehicleFromFilter', function (arg) { return OxVehicle.getFromFilter(arg); });
exports('GetVehicles', function (arg) { return OxVehicle.getAll(arg, true); });
exports('GenerateVehicleVin', function (model) { return OxVehicle.generateVin((0, vehicles_1.GetVehicleData)(model)); });
exports('GenerateVehiclePlate', function (pattern) { return OxVehicle.generatePlate(pattern); });
