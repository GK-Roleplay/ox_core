"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var class_1 = require("./class");
on('onResourceStop', function (resource) { return class_1.OxVehicle.saveAll(resource); });
on('entityRemoved', function (entityId) { var _a; return (_a = class_1.OxVehicle.getFromEntity(entityId)) === null || _a === void 0 ? void 0 : _a.respawn(); });
