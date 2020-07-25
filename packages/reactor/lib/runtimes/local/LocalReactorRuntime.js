"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TaskManager_1 = require("./TaskManager");
var EffectsRuntime_1 = require("./effects/EffectsRuntime");
function LocalRuntime() {
    var state = {
        reactions: new Set(),
        taskManager: TaskManager_1.default(),
        spawnedReactionIDs: new Set()
    };
    var effectsRuntime = EffectsRuntime_1.buildEffectsRuntime(state);
    var runtime = {
        put: function (reagent) {
            effectsRuntime.put(reagent);
        },
        addReaction: function (reactionGenerator) {
            state.reactions.add(reactionGenerator);
        },
        run: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!runtime.isRunning()) {
                state.taskManager.pauseQueue();
                state.reactions.forEach(function (reactionGenerator) {
                    effectsRuntime.spawn.apply(effectsRuntime, __spreadArrays([reactionGenerator], args));
                });
                state.taskManager.resumeQueue();
                state.taskManager.runQueue();
                return true;
            }
            else {
                return false;
            }
        },
        stop: function (stopValue) {
            if (runtime.isRunning()) {
                state.taskManager.cancelAll(stopValue);
                return true;
            }
            else {
                return false;
            }
        },
        isRunning: function () {
            return 0 < state.spawnedReactionIDs.size;
        }
    };
    return Object.freeze(runtime);
}
exports.default = LocalRuntime;
//# sourceMappingURL=LocalReactorRuntime.js.map