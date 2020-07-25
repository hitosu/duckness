"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("./effects");
function spawnReaction(reaction, reactionArgs, onDone, effectsRuntime) {
    var state = {
        done: false,
        curentInstructionTaskID: null
    };
    var reactionGenerator = reaction(reactionArgs);
    function advanceReaction(advanceValue) {
        var currentIteration = reactionGenerator.next(advanceValue);
        if (currentIteration.done) {
            state.done = true;
            if (onDone) {
                onDone();
            }
        }
        else {
            var currentInstruction = currentIteration.value;
            if ('object' === typeof currentInstruction && currentInstruction.type) {
                if ('spawn' === currentInstruction.type) {
                    effectsRuntime.spawnReaction.apply(effectsRuntime, __spreadArrays([currentInstruction.payload], currentInstruction.args));
                }
                else if (effects_1.default[currentInstruction.type]) {
                    state.curentInstructionTaskID = effectsRuntime.addTask(effects_1.default[currentInstruction.type], function (advanceValue) {
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
            if (state.done) {
                return false;
            }
            else {
                if (null != state.curentInstructionTaskID) {
                    effectsRuntime.cancelTask(state.curentInstructionTaskID, cancelValue);
                    state.curentInstructionTaskID = null;
                }
                reactionGenerator.return(cancelValue);
                state.done = true;
                return true;
            }
        },
        curentInstructionTaskID: function () {
            return state.curentInstructionTaskID;
        }
    };
}
exports.default = spawnReaction;
//# sourceMappingURL=ReactionRuntime.js.map