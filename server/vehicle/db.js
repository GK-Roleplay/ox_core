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
exports.IsPlateAvailable = IsPlateAvailable;
exports.IsVinAvailable = IsVinAvailable;
exports.GetStoredVehicleFromId = GetStoredVehicleFromId;
exports.SetVehicleColumn = SetVehicleColumn;
exports.SaveVehicleData = SaveVehicleData;
exports.CreateNewVehicle = CreateNewVehicle;
exports.DeleteVehicle = DeleteVehicle;
var db_1 = require("../db");
var config_1 = require("config");
if (config_1.DEFAULT_VEHICLE_STORE)
    setImmediate(function () { return db_1.db.query('UPDATE vehicles SET `stored` = ? WHERE `stored` IS NULL', [config_1.DEFAULT_VEHICLE_STORE]); });
function IsPlateAvailable(plate) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.exists('SELECT 1 FROM vehicles WHERE plate = ?', [plate])];
                case 1: return [2 /*return*/, !(_a.sent())];
            }
        });
    });
}
function IsVinAvailable(plate) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.exists('SELECT 1 FROM vehicles WHERE vin = ?', [plate])];
                case 1: return [2 /*return*/, !(_a.sent())];
            }
        });
    });
}
function GetStoredVehicleFromId(id_1) {
    return __awaiter(this, arguments, void 0, function (id, column) {
        var row;
        if (column === void 0) { column = 'id'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.row("SELECT id, owner, `group`, plate, vin, model, data FROM vehicles WHERE ".concat(column, " = ? AND `stored` IS NOT NULL"), [id])];
                case 1:
                    row = _a.sent();
                    if (row && typeof row.data === 'string') {
                        console.warn('vehicle.data was selected from the database as a string rather than JSON.\nLet us know if this warning occurred..');
                        row.data = JSON.parse(row.data);
                    }
                    return [2 /*return*/, row];
            }
        });
    });
}
function SetVehicleColumn(id, column, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        return [2 /*return*/];
                    return [4 /*yield*/, db_1.db.update("UPDATE vehicles SET `".concat(column, "` = ? WHERE id = ?"), [value, id])];
                case 1: return [2 /*return*/, (_a.sent()) === 1];
            }
        });
    });
}
function SaveVehicleData(values, // -.-
batch) {
    var query = 'UPDATE vehicles SET `stored` = ?, data = ? WHERE id = ?';
    return batch ? db_1.db.batch(query, values) : db_1.db.update(query, values);
}
function CreateNewVehicle(plate, vin, owner, group, model, vehicleClass, data, stored) {
    return db_1.db.insert('INSERT INTO vehicles (plate, vin, owner, `group`, model, class, data, `stored`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [plate, vin, owner, group, model, vehicleClass, JSON.stringify(data), stored]);
}
function DeleteVehicle(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.db.update('DELETE FROM vehicles WHERE id = ?', [id])];
                case 1: return [2 /*return*/, (_a.sent()) === 1];
            }
        });
    });
}
