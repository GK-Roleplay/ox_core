"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetConfig = GetConfig;
function GetConfig() {
    var connectionString = GetConvar('mysql_connection_string', 'mysql://root@localhost').replace('mysql://', 'mariadb://');
    function parseUri() {
        var splitMatchGroups = connectionString.match(/^(?:([^:\/?#.]+):)?(?:\/\/(?:([^\/?#]*)@)?([\w\d\-\u0100-\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\?([^#]*))?$/);
        if (!splitMatchGroups)
            throw new Error("mysql_connection_string structure was invalid (".concat(connectionString, ")"));
        var authTarget = splitMatchGroups[2] ? splitMatchGroups[2].split(':') : [];
        return __assign({ user: authTarget[0] || undefined, password: authTarget[1] || undefined, host: splitMatchGroups[3], port: Number.parseInt(splitMatchGroups[4]), database: splitMatchGroups[5].replace(/^\/+/, '') }, (splitMatchGroups[6] &&
            splitMatchGroups[6].split('&').reduce(function (connectionInfo, parameter) {
                var _a = parameter.split('='), key = _a[0], value = _a[1];
                connectionInfo[key] = value;
                return connectionInfo;
            }, {})));
    }
    var options = connectionString.includes('mariadb://')
        ? parseUri()
        : connectionString
            .replace(/(?:host(?:name)|ip|server|data\s?source|addr(?:ess)?)=/gi, 'host=')
            .replace(/(?:user\s?(?:id|name)?|uid)=/gi, 'user=')
            .replace(/(?:pwd|pass)=/gi, 'password=')
            .replace(/(?:db)=/gi, 'database=')
            .split(';')
            .reduce(function (connectionInfo, parameter) {
            var _a = parameter.split('='), key = _a[0], value = _a[1];
            if (key)
                connectionInfo[key] = value;
            return connectionInfo;
        }, {});
    if (typeof options.ssl === 'string') {
        try {
            options.ssl = JSON.parse(options.ssl);
        }
        catch (err) {
            console.log("^3Failed to parse ssl in configuration (".concat(err, ")!^0"));
        }
    }
    return __assign(__assign({ connectTimeout: 60000, connectionLimit: 5, acquireTimeout: 30000 }, options), { namedPlaceholders: false, multipleStatements: true, dateStrings: true, insertIdAsNumber: true, decimalAsNumber: true, autoJsonMap: true, jsonStrings: false });
}
