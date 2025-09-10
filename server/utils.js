"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayerLicense = GetPlayerLicense;
exports.GetIdentifiers = GetIdentifiers;
var config_1 = require("config");
function GetPlayerLicense(playerId) {
    return (GetPlayerIdentifierByType(playerId, 'license2') ||
        GetPlayerIdentifierByType(playerId, 'license'));
}
function GetIdentifiers(playerId) {
    var identifiers = {};
    playerId = playerId.toString();
    for (var index = 0; index < GetNumPlayerIdentifiers(playerId); index++) {
        var _a = GetPlayerIdentifier(playerId, index).split(':'), prefix = _a[0], identifier = _a[1];
        if (prefix !== 'ip')
            identifiers[prefix] = identifier;
    }
    if (!identifiers.license2) {
        identifiers.license2 = config_1.SV_LAN ? 'fayoum' : identifiers.license;
        if (!identifiers.license2)
            throw new Error("No license2 found for user [".concat(playerId, "] ").concat(GetPlayerName(playerId)));
    }
    return identifiers;
}
