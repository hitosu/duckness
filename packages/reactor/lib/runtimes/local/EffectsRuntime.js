"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEffectsRuntime = void 0;
var ReactionRuntime_1 = require("./ReactionRuntime");
function buildEffectsRuntime(reactorState) {
    var reagentListeners = new Map();
    var effectsRuntime = {
        addTask: function (worker, onDone) {
            var _a;
            var workerArgs = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                workerArgs[_i - 2] = arguments[_i];
            }
            return (_a = reactorState.taskManager).add.apply(_a, __spreadArray([worker, onDone], workerArgs, false));
        },
        cancelTask: function (id, cancelValue) {
            return reactorState.taskManager.cancel(id, cancelValue);
        },
        runTasksQueue: function (resume) {
            reactorState.taskManager.runQueue(resume);
        },
        spawnReaction: function (reaction) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var spawnedReaction = (0, ReactionRuntime_1.default)(reaction, args, function () {
                reactorState.spawnedReactions.delete(spawnedReaction);
            }, effectsRuntime);
            reactorState.spawnedReactions.add(spawnedReaction);
            reactorState.taskManager.runQueue();
            return spawnedReaction;
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
        },
        setContext: function (props) {
            if (props === void 0) { props = {}; }
            Object.assign(reactorState.context, props);
        },
        getContext: function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            var context = {};
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                context[key] = reactorState.context[key];
            }
            return context;
        }
    };
    return effectsRuntime;
}
exports.buildEffectsRuntime = buildEffectsRuntime;
//# sourceMappingURL=EffectsRuntime.js.map