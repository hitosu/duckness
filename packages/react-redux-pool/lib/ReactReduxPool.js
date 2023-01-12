"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_redux_1 = require("react-redux");
function ReactReduxPool(pool, renderRoot) {
    if (renderRoot === void 0) { renderRoot = function (_props) { return null; }; }
    var render = function () {
        if (null == pool.store)
            pool.build(pool.props);
        return React.createElement(react_redux_1.Provider, { store: pool.store }, renderRoot(pool.props));
    };
    var reactReduxPool = {};
    Object.defineProperty(reactReduxPool, 'render', { value: render, writable: false, enumerable: true });
    Object.keys(pool).forEach(function (poolKey) {
        Object.defineProperty(reactReduxPool, poolKey, {
            get: function () {
                return pool[poolKey];
            },
            enumerable: true
        });
    });
    return reactReduxPool;
}
exports.default = ReactReduxPool;
//# sourceMappingURL=ReactReduxPool.js.map