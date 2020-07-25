"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var putEffect = function (onDone, effect, effectsRuntime) {
    var reagent = effect.payload;
    effectsRuntime.put(reagent);
    onDone(reagent);
    return {};
};
exports.default = putEffect;
//# sourceMappingURL=put.js.map