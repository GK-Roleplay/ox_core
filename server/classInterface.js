"use strict";
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
exports.ClassInterface = void 0;
var ClassInterface = /** @class */ (function () {
    function ClassInterface() {
    }
    ClassInterface.isCallValid = function (method, id, member) {
        if (!member)
            return console.error("cannot call method ".concat(method, " on ").concat(this.name, "<").concat(id, "> (invalid id)"));
        if (!member[method])
            return console.error("cannot call method ".concat(method, " on ").concat(this.name, "<").concat(id, "> (method does not exist)"));
        if (!this.callableMethods[method])
            return console.error("cannot call method ".concat(method, " on ").concat(this.name, "<").concat(id, "> (method is not exported)"));
        return true;
    };
    /** Exports several class methods and makes non-private methods callable from external resources. */
    ClassInterface.init = function () {
        var _this = this;
        var classMethods = Object.getOwnPropertyNames(this.prototype);
        if (classMethods) {
            this.callableMethods = {};
            classMethods.forEach(function (method) {
                if (method !== 'constructor')
                    _this.callableMethods[method] = true;
            });
        }
        var name = this.name;
        var expName = this.name.replace('Ox', '');
        // e.g. exports.ox_core.GetPlayer
        exports("Get".concat(expName), function (id) { return _this.get(id); });
        // e.g. exports.ox_core.GetPlayerCalls
        exports("Get".concat(expName, "Calls"), function () { return _this.callableMethods; });
        // e.g. exports.ox_core.CallPlayer
        exports("Call".concat(expName), function (id, method) {
            var _a;
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            // Maintain backwards compatibility with OxVehicle indexed by entityId..
            var member = expName === 'Vehicle' && typeof id === 'number' ? (_a = _this.keys) === null || _a === void 0 ? void 0 : _a.entity[id] : _this.get(id);
            if (member instanceof Promise) {
                return member.then(function (resolvedMember) {
                    if (!_this.isCallValid(method, id, resolvedMember))
                        return;
                    return resolvedMember.call.apply(resolvedMember, __spreadArray([method], args, false));
                });
            }
            if (!_this.isCallValid(method, id, member))
                return;
            return member.call.apply(member, __spreadArray([method], args, false));
        });
        DEV: console.info("Instantiated ClassInterface<".concat(name, "> and exports"));
        return this;
    };
    ClassInterface.prototype.call = function (method) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this)[method].apply(_a, args);
    };
    /** Get a member of the class by its id. */
    ClassInterface.get = function (id) {
        return this.members[id];
    };
    /** Get all members of the class. */
    ClassInterface.getAll = function () {
        return this.members;
    };
    /** Adds a new member of the class to its registries. */
    ClassInterface.add = function (id, member) {
        if (this.members[id])
            return false;
        this.members[id] = member;
        if (this.keys) {
            Object.entries(this.keys).forEach(function (_a) {
                var key = _a[0], obj = _a[1];
                if (member[key]) {
                    obj[member[key]] = member;
                }
            });
        }
        return true;
    };
    /** Removes a member of the class from its registries. */
    ClassInterface.remove = function (id) {
        var member = this.members[id];
        if (!member)
            return false;
        if (this.keys) {
            Object.entries(this.keys).forEach(function (_a) {
                var key = _a[0], obj = _a[1];
                if (member[key]) {
                    delete obj[member[key]];
                }
            });
        }
        delete this.members[id];
        return true;
    };
    return ClassInterface;
}());
exports.ClassInterface = ClassInterface;
