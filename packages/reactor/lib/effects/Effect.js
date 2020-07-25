"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function effectConstructor(type) {
    return function (payload) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return { type: type, payload: payload, args: args };
    };
}
exports.default = effectConstructor;
//# sourceMappingURL=Effect.js.map