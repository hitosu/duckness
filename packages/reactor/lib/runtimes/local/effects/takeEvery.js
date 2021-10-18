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
var ReactionRuntime_1 = require("../ReactionRuntime");
var takeEveryEffect = function (onDone, effect, effectsRuntime) {
    var reagentTypesToTake = Array.isArray(effect.payload) ? effect.payload : [effect.payload];
    var reaction = effect.args[0];
    var reactionArgs = effect.args.slice(1);
    var unsubscribes = reagentTypesToTake.map(function (reagentType) {
        return effectsRuntime.takeEvery(reagentType, function (reagent) {
            (0, ReactionRuntime_1.default)(reaction, __spreadArray(__spreadArray([], reactionArgs, true), [reagent], false), null, effectsRuntime);
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