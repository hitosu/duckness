"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEffectsRuntime = void 0;
var effects_1 = require("../../../effects");
var spawn_1 = require("./spawn");
function buildEffectsRuntime(reactorState) {
    var reagentListeners = new Map();
    var effectsRuntime = {
        addTask: function (worker, onDone) {
            var _a;
            var workerArgs = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                workerArgs[_i - 2] = arguments[_i];
            }
            return (_a = reactorState.taskManager).add.apply(_a, __spreadArrays([worker, onDone], workerArgs));
        },
        cancelTask: function (id, cancelValue) {
            return reactorState.taskManager.cancel(id, cancelValue);
        },
        runTasksQueue: function (resume) {
            reactorState.taskManager.runQueue(resume);
        },
        spawn: function (reactionGenerator) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var effect = effects_1.spawn.apply(void 0, __spreadArrays([reactionGenerator], args));
            var spawnedTaskID = reactorState.taskManager.add(spawn_1.default, function () {
                reactorState.spawnedReactionIDs.delete(spawnedTaskID);
            }, effect, effectsRuntime);
            reactorState.spawnedReactionIDs.add(spawnedTaskID);
            reactorState.taskManager.runQueue();
        },
        put: function (reagent) {
            if (reagentListeners.has(reagent.type)) {
                reagentListeners.get(reagent.type).forEach(function (listener) {
                    listener(reagent);
                });
            }
        },
        takeEvery: function (reagentType, listener) {
            if (reagentListeners.has(reagentType)) {
                var listeners = reagentListeners.get(reagentType);
                listeners.add(listener);
            }
            else {
                var listeners = new Set();
                listeners.add(listener);
                reagentListeners.set(reagentType, listeners);
            }
            return function () {
                if (reagentListeners.has(reagentType)) {
                    var listeners = reagentListeners.get(reagentType);
                    listeners.delete(listener);
                    if (0 == listeners.size) {
                        reagentListeners.delete(reagentType);
                    }
                }
            };
        },
        take: function (reagentType, listener) {
            var stopTaking = effectsRuntime.takeEvery(reagentType, function (reagent) {
                stopTaking();
                listener(reagent);
            });
            return stopTaking;
        }
    };
    return effectsRuntime;
}
exports.buildEffectsRuntime = buildEffectsRuntime;
//# sourceMappingURL=EffectsRuntime.js.map