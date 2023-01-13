"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineSelectors = exports.connect = exports.useDispatch = exports.useDispatchAction = void 0;
var use_redux_1 = require("@duckness/use-redux");
Object.defineProperty(exports, "combineSelectors", { enumerable: true, get: function () { return use_redux_1.combineSelectors; } });
function usePool(pool, selector, shouldUpdate, shouldSelect) {
    return (0, use_redux_1.default)(pool.store, selector, shouldUpdate, shouldSelect);
}
exports.default = usePool;
function useDispatchAction(pool, actionCreator, payloadTransformer) {
    return (0, use_redux_1.useDispatchAction)(pool.store, actionCreator, payloadTransformer);
}
exports.useDispatchAction = useDispatchAction;
function useDispatch(pool, dispatcher, deps) {
    if (deps === void 0) { deps = []; }
    return (0, use_redux_1.useDispatch)(pool.store, dispatcher, deps);
}
exports.useDispatch = useDispatch;
function connect(pool, selector, shouldUpdate, shouldSelect, dispatch) {
    if (dispatch === void 0) { dispatch = pool.dispatch; }
    return (0, use_redux_1.connect)(pool.store, selector, shouldUpdate, shouldSelect, dispatch);
}
exports.connect = connect;
//# sourceMappingURL=usePool.js.map