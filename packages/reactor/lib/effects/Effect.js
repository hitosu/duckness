"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEffect = void 0;
function isEffect(effect) {
    return effect instanceof Object && Boolean(effect.type);
}
exports.isEffect = isEffect;
function effectConstructor(type) {
    return function (payload) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var effect = { type: type, payload: payload, args: args };
        return effect;
    };
}
exports.default = effectConstructor;
//# sourceMappingURL=Effect.js.map