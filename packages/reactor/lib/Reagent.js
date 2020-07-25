"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Reagent(type, payloadBuilder, reagentTransformer) {
    var reagentConstructor = function reagentConstructor(payload) {
        var reagent = {
            type: type,
            payload: payloadBuilder ? payloadBuilder(payload) : payload
        };
        return reagentTransformer ? reagentTransformer(reagent) : reagent;
    };
    Object.defineProperty(reagentConstructor, 'reagentType', {
        get: function () {
            return type;
        },
        enumerable: true
    });
    return reagentConstructor;
}
exports.default = Reagent;
//# sourceMappingURL=Reagent.js.map