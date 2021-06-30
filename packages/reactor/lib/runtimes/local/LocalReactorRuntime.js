"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TaskManager_1 = require("./TaskManager");
var EffectsRuntime_1 = require("./EffectsRuntime");
function LocalRuntime() {
    var state = {
        reactions: new Set(),
        taskManager: TaskManager_1.default(),
        spawnedReactions: new Set(),
        context: {}
    };
    var effectsRuntime = EffectsRuntime_1.buildEffectsRuntime(state);
    var runtime = {
        put: function (reagent) {
            effectsRuntime.put(reagent);
        },
        addReaction: function (reaction) {
            state.reactions.add(reaction);
        },
        takeEvery: function (reagentTypes, listener) {
            var unsubscribes = (Array.isArray(reagentTypes)
                ? reagentTypes
                : [reagentTypes]).map(function (reagentType) { return effectsRuntime.takeEvery(reagentType, listener); });
            return function () {
                unsubscribes.forEach(function (unsubscribe) { return unsubscribe(); });
                unsubscribes.splice(0, unsubscribes.length);
            };
        },
        run: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!runtime.isRunning()) {
                state.taskManager.pauseQueue();
                state.reactions.forEach(function (reaction) {
                    effectsRuntime.spawnReaction.apply(effectsRuntime, __spreadArray([reaction], args));
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
                state.spawnedReactions.forEach(function (reaction) {
                    reaction.cancel(stopValue);
                });
                state.spawnedReactions.clear();
                state.taskManager.cancelAll(stopValue);
                return true;
            }
            else {
                return false;
            }
        },
        setContext: function (props) {
            if (props === void 0) { props = {}; }
            effectsRuntime.setContext(props);
        },
        getContext: function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            return effectsRuntime.getContext.apply(effectsRuntime, keys);
        },
        isRunning: function () {
            return 0 < state.spawnedReactions.size;
        }
    };
    return Object.freeze(runtime);
}
exports.default = LocalRuntime;
//# sourceMappingURL=LocalReactorRuntime.js.map