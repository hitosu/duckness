"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var delayEffect = function (onDone, effect, _effectsRuntime) {
    var delayTime = effect.payload;
    var timerID = setTimeout(function () {
        onDone();
    }, delayTime);
    return {
        cancel: function () {
            if (null != timerID) {
                clearTimeout(timerID);
                timerID = null;
                return true;
            }
            else {
                return false;
            }
        }
    };
};
exports.default = delayEffect;
//# sourceMappingURL=delay.js.map