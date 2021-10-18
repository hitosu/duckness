"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReactionRuntime_1 = require("../ReactionRuntime");
var spawnEffect = function (onDone, effect, effectsRuntime) {
    var spawnedReaction = (0, ReactionRuntime_1.default)(effect.payload, effect.args, null, effectsRuntime);
    onDone(spawnedReaction);
    return {};
};
exports.default = spawnEffect;
//# sourceMappingURL=spawn.js.map