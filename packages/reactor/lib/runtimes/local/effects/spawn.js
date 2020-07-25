"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("../effects");
var spawnEffect = function (onDone, effect, effectsRuntime) {
    var done = false;
    var curentInstructionTaskID = null;
    var reactionGenerator = effect.payload(effect.args);
    function advanceReaction(advanceValue) {
        var currentIteration = reactionGenerator.next(advanceValue);
        if (currentIteration.done) {
            done = true;
            onDone();
        }
        else {
            var currentInstruction = currentIteration.value;
            if ('object' === typeof currentInstruction && currentInstruction.type) {
                if ('spawn' === currentInstruction.type) {
                    effectsRuntime.spawn.apply(effectsRuntime, __spreadArrays([currentInstruction.payload], currentInstruction.args));
                }
                else if (effects_1.default[currentInstruction.type]) {
                    curentInstructionTaskID = effectsRuntime.addTask(effects_1.default[currentInstruction.type], function (advanceValue) {
                        advanceReaction(advanceValue);
                    }, currentInstruction, effectsRuntime);
                    effectsRuntime.runTasksQueue();
                }
            }
        }
    }
    advanceReaction();
    return {
        cancel: function (cancelValue) {
            if (done) {
                return false;
            }
            else {
                if (null != curentInstructionTaskID) {
                    effectsRuntime.cancelTask(curentInstructionTaskID, cancelValue);
                    curentInstructionTaskID = null;
                }
                reactionGenerator.return(cancelValue);
                done = true;
                return true;
            }
        }
    };
};
exports.default = spawnEffect;
//# sourceMappingURL=spawn.js.map