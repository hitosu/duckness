"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ReactionRuntime_1 = require("../ReactionRuntime");
var takeEveryEffect = function (onDone, effect, effectsRuntime) {
    var reagentTypesToTake = Array.isArray(effect.payload) ? effect.payload : [effect.payload];
    var reaction = effect.args[0];
    var reactionArgs = effect.args.slice(1);
    var unsubscribes = reagentTypesToTake.map(function (reagentType) {
        return effectsRuntime.takeEvery(reagentType, function (reagent) {
            ReactionRuntime_1.default(reaction, __spreadArrays(reactionArgs, [reagent]), null, effectsRuntime);
        });
    });
    return {
        cancel: function () {
            if (unsubscribes.length) {
                unsubscribes.forEach(function (unsubscribe) { return unsubscribe(); });
                onDone();
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