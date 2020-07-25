"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var takeEveryEffect = function (onDone, effect, effectsRuntime) {
    var reagentTypesToTake = __spreadArrays([effect.payload], effect.args);
    var unsubscribes = reagentTypesToTake.map(function (reagentType) {
        return effectsRuntime.takeEvery(reagentType, function (reagent) {
            unsubscribes.forEach(function (unsubscribe) { return unsubscribe(); });
            unsubscribes.splice(0, unsubscribes.length);
            onDone(reagent);
        });
    });
    return {
        cancel: function () {
            if (unsubscribes.length) {
                unsubscribes.forEach(function (unsubscribe) { return unsubscribe(); });
                return true;
            }
            else {
                return false;
            }
        }
    };
};
exports.default = takeEveryEffect;
//# sourceMappingURL=takeEvery.js.map