"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ReactionRuntime_1 = require("../ReactionRuntime");
var takeEveryEffect = function (onDone, effect, effectsRuntime) {
    var reagentTypesToTake = Array.isArray(effect.payload) ? effect.payload : [effect.payload];
    var reaction = effect.args[0];
    var reactionArgs = effect.args.slice(1);
    var unsubscribes = reagentTypesToTake.map(function (reagentType) {
        return effectsRuntime.takeEvery(reagentType, function (reagent) {
            ReactionRuntime_1.default(reaction, __spreadArray(__spreadArray([], reactionArgs), [reagent]), null, effectsRuntime);
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