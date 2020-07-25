"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactionRuntime_1 = require("../ReactionRuntime");
var spawnEffect = function (onDone, effect, effectsRuntime) {
    var spawnedReaction = ReactionRuntime_1.default(effect.payload, effect.args, onDone, effectsRuntime);
    return {
        cancel: spawnedReaction.cancel
    };
};
exports.default = spawnEffect;
//# sourceMappingURL=call.js.map