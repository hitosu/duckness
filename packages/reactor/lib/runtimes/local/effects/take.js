"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var takeEffect = function (onDone, effect, effectsRuntime) {
    var reagentTypesToTake = Array.isArray(effect.payload) ? effect.payload : [effect.payload];
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
                unsubscribes.splice(0, unsubscribes.length);
                return true;
            }
            else {
                return false;
            }
        }
    };
};
exports.default = takeEffect;
//# sourceMappingURL=take.js.map