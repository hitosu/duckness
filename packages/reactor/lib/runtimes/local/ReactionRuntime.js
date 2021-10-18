"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var effects_1 = require("./effects");
var Effect_1 = require("../../effects/Effect");
function spawnReaction(reaction, reactionArgs, onDone, effectsRuntime) {
    var state = {
        done: false,
        curentInstructionTaskID: null
    };
    var reactionGenerator = reaction.apply(void 0, reactionArgs);
    function advanceReaction(advanceValue) {
        var currentIteration = reactionGenerator.next(advanceValue);
        if (currentIteration.done) {
            state.done = true;
            if (onDone) {
                onDone(currentIteration.value);
            }
        }
        else {
            var currentInstruction = currentIteration.value;
            if ((0, Effect_1.isEffect)(currentInstruction)) {
                if (effects_1.default[currentInstruction.type]) {
                    state.curentInstructionTaskID = effectsRuntime.addTask(effects_1.default[currentInstruction.type], function (advanceValue) {
                        advanceReaction(advanceValue);
                    }, currentInstruction, effectsRuntime);
                    effectsRuntime.runTasksQueue();
                }
            }
            else {
                Promise.resolve(currentInstruction).then(function (value) { return advanceReaction(value); });
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