"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ox = void 0;
exports.GetGroup = GetGroup;
exports.Ox = exports.ox_core;
function GetGroup(name) {
    return GlobalState["group.".concat(name)];
}
