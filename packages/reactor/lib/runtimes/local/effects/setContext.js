"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setContextEffect = function (onDone, effect, effectsRuntime) {
    var context = effect.payload || {};
    effectsRuntime.setContext(context);
    onDone();
    return {};
};
exports.default = setContextEffect;
//# sourceMappingURL=setContext.js.map