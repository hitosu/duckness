"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var spawnEffect = function (onDone, effect, _effectsRuntime) {
    var reactionGenerator = effect.payload(effect.args);
    function advanceReaction(advanceValue) {
        var currentIteration = reactionGenerator.next(advanceValue);
        if (currentIteration.done) {
            onDone();
        }
        else {
            var currentInstruction = currentIteration.value;
            console.log('currentInstruction', currentInstruction);
            advanceReaction({});
        }
    }
    advanceReaction();
    return {
        cancel: function () {
            return true;
        }
    };
};
exports.default = spawnEffect;
//# sourceMappingURL=spawn.js.map