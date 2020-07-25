"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getContextEffect = function (onDone, effect, effectsRuntime) {
    var keys = Array.isArray(effect.payload) ? effect.payload : [effect.payload];
    onDone(effectsRuntime.getContext.apply(effectsRuntime, keys));
    return {};
};
exports.default = getContextEffect;
//# sourceMappingURL=getContext.js.map